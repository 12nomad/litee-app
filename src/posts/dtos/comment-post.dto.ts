import { PickType } from '@nestjs/mapped-types';

import { PostIdDto } from './post-id.dto';

export class CommentPostDto extends PickType(PostIdDto, ['postId']) {
  comment: string;
}
