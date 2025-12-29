import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import fetch from 'node-fetch';
import { SearchRepoDto } from 'src/dto/search-repo.dto';
import { RepoSummaryDto } from 'src/dto/repo-summary.dto';

@Injectable()
export class GithubService {
  private readonly baseUrl: string;
  private readonly token: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.baseUrl = this.configService.get<string>('github.baseUrl')!;
    this.token = this.configService.get<string>('github.token') ?? "";
  }

  private getAuthHeaders() {
    return {
      Accept: 'application/vnd.github+json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      'User-Agent': 'git-search-app',
    };
  }

  async searchRepos(term: string): Promise<SearchRepoDto[]> {

    const url = `${this.baseUrl}/search/repositories?q=${encodeURIComponent(term)}`;

    const res = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data: any = await res.json();

    return (data.items ?? []).map((repo: any) => new SearchRepoDto({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
    }),
    );
  }

  private async getBranchCount(fullName: string): Promise<number> {
    const perPage = 100;
    let page = 1;
    let total = 0;

    while (true) {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/repos/${fullName}/branches`,
          {
            params: { per_page: perPage, page },
            headers: this.getAuthHeaders(),
          },
        ),
      );

      const branches = response.data as any[];
      if (!Array.isArray(branches)) {
        break;
      }

      total += branches.length;

      if (branches.length < perPage) {
        break;
      }
      page += 1;
    }

    return total;
  }

  private async getCommitsLastYear(fullName: string): Promise<number> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/repos/${fullName}/stats/commit_activity`,
      ),
    );

    if (!Array.isArray(response.data)) {
      return 0;
    }

    return response.data.reduce((sum: number, week: any) => {
      return sum + (week.total || 0);
    }, 0);
  }

  async getRepoSummary(id: string) {
    const repoResponse = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/repositories/${id}`, {
        headers: this.getAuthHeaders(),
      }),
    );
    const repo = repoResponse.data;
    const fullName = repoResponse.data.full_name;

    const [branchesCount, commitsLastYear] = await Promise.all([
      this.getBranchCount(fullName),
      this.getCommitsLastYear(fullName),
    ]);

    return new RepoSummaryDto({
      id: repo.id,
      name: fullName,
      description: repo.description || 'No description',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      commitsLastYear,
      branchesCount,
      url: repo.html_url
    });
  }
}