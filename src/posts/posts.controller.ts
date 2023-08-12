import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { PostIdDto } from './dtos/post-id.dto';
import { RepostDto } from './dtos/repost.dto';
import { CommentPostDto } from './dtos/comment-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getFeedPosts(
    @AuthUser('sub') sub: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.postsService.getFeedPosts(sub, page);
  }

  @Get(':postId')
  getPostById(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.getPostById(postId);
  }

  @Post('create-post')
  logout(@AuthUser('sub') sub: number, @Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(sub, createPostDto);
  }

  @Patch('toggle-like')
  toggleLike(@AuthUser('sub') sub: number, @Body() postIdDto: PostIdDto) {
    return this.postsService.toggleLike(sub, postIdDto);
  }

  @Post('repost')
  repost(@AuthUser('sub') sub: number, @Body() repostDto: RepostDto) {
    return this.postsService.repost(sub, repostDto);
  }

  @Post('undo-repost')
  undoRepost(@AuthUser('sub') sub: number, @Body() postIdDto: PostIdDto) {
    return this.postsService.undoRepost(sub, postIdDto);
  }

  @Post('comment-post')
  commentPost(
    @AuthUser('sub') sub: number,
    @Body() commentPostDto: CommentPostDto,
  ) {
    return this.postsService.commentPost(sub, commentPostDto);
  }

  @Patch('save-post')
  toggleSavePost(@AuthUser('sub') sub: number, @Body() postIdDto: PostIdDto) {
    return this.postsService.toggleSavePost(sub, postIdDto);
  }

  @Delete()
  deletePost(@Body() postIdDto: PostIdDto) {
    return this.postsService.deletePost(postIdDto);
  }
}
