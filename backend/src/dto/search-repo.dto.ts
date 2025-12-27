import { Expose } from 'class-transformer';

export class SearchRepoDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  fullName: string;

  constructor(partial: Partial<SearchRepoDto>) {
    Object.assign(this, partial);
  }
}
