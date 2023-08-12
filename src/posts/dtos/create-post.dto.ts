import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  media?: string;
}
