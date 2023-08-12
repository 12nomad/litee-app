import { IsNumber } from 'class-validator';

export class PostIdDto {
  @IsNumber()
  postId: number;
}
