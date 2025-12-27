import { IsNotEmpty, IsString } from 'class-validator';

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'Query parameter "term" is required' })
  term: string;
}
