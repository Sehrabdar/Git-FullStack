import { Controller, Get, Query, BadRequestException, Param } from '@nestjs/common';
import { GithubService } from './github.service';

import { SearchRepoDto } from '../dto/search-repo.dto';
import { RepoSummaryDto } from '../dto/repo-summary.dto';
import { SearchQueryDto } from '../dto/search-query.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) { }

  @Get('search-repos')
  async searchRepos(@Query() query: SearchQueryDto):Promise<SearchRepoDto[]> {
    return this.githubService.searchRepos(query.term);
  }

  @Get(':id/summary')
  async getRepoSummary(@Param('id') id: string):Promise<RepoSummaryDto> {
    return this.githubService.getRepoSummary(id);
  }
}