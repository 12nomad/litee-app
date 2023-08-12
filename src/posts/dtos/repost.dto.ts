import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RepostDto {
  @IsNumber()
  postId: number;

  @IsString()
  @IsOptional()
  comment?: string;
}
