import { Expose } from 'class-transformer';

export class RepoSummaryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  stars: number;

  @Expose()
  forks: number;

  @Expose()
  language: string;

  @Expose()
  commitsLastYear: number;

  @Expose()
  branchesCount: number;

  @Expose()
  url: string;

  constructor(partial: Partial<RepoSummaryDto>) {
    Object.assign(this, partial);
  }
}
