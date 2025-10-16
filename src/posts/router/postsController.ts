import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { createQuery } from '../../utils/createDefaultQuery';
import {
  handleCreatedResult,
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../core/resultCode/result-code';
import { createDefaultQuery } from '../../core/middlewares/validations/query_validation.middleware';
import { PostsQueryRepository } from '../repositories/postsQuery.repository';
import { BaseQueryInput } from '../../core';
import { CommentsService } from '../../comments/services/comments.service';
import { PostsService } from '../services/posts.service';
import { jwtService } from '../../auth/service/jwtService';
import { CommentsQueryRepository } from '../../comments/repositories/comments.queryRepositiry';

@injectable()
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  async getPostsHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({});
    const searchQuery = createQuery(req.query, defaultQuery);
    const token = req.headers.authorization;
    const userId = jwtService.getUserIdByAccessToken(token);
    const items = await this.postsQueryRepository.getAllPosts(
      searchQuery,
      userId,
    );

    handleResult(res, handleSuccessResult(items));
  }

  async getPostByIdHandler(req: Request, res: Response) {
    const id = req.params.id;

    const token = req.headers.authorization;
    const userId = jwtService.getUserIdByAccessToken(token);

    const post = await this.postsQueryRepository.getPost(id, userId);

    if (!post) {
      handleResult(res, handleNotFoundResult());
      return;
    }

    handleResult(res, handleSuccessResult(post));
  }

  async createPostHandler(req: Request, res: Response) {
    const postId = await this.postsService.createPost(req.body);

    if (typeof postId !== 'string') {
      return handleResult(res, handleNotFoundResult());
    }

    const post = await this.postsQueryRepository.getPost(postId);

    handleResult(res, handleCreatedResult(post));
  }

  async updatePostHandler(req: Request, res: Response) {
    const id = req.params.id;

    const response = await this.postsService.updatePost(id, req.body);

    handleResult(res, response);
  }

  async deletePostHandler(req: Request, res: Response) {
    const id = req.params.id;

    const response = await this.postsService.deletePost(id);
    handleResult(res, response);
  }

  async getPostCommentsHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({});
    const postId = req.params.id;
    const token = req.headers.authorization;

    const userId = jwtService.getUserIdByAccessToken(token) || '';
    const searchQuery: BaseQueryInput = createQuery(req.query, defaultQuery);
    const post = await this.postsQueryRepository.getPost(postId);

    if (!post) {
      return handleResult(res, handleNotFoundResult());
    }

    const result = await this.commentsQueryRepository.findCommentsByPostId(
      userId,
      postId,
      searchQuery,
    );

    return handleResult(res, handleSuccessResult(result));
  }

  async createCommentHandler(req: Request, res: Response) {
    const postId = req.params.id;
    const user = req.user;

    const post = await this.postsQueryRepository.getPost(postId);
    if (!post) return handleResult(res, handleNotFoundResult());

    if (!user) {
      return handleResult(res, handleUnauthorizedResult());
    }
    const commentId = await this.commentsService.createComment(
      req.body,
      user,
      postId,
    );

    const result = await this.commentsQueryRepository.findCommentById(
      commentId,
      user.id,
    );

    return handleResult(res, handleCreatedResult(result));
  }

  async setLikeStatusesHandler(req: Request, res: Response) {
    const postId = req.params.id;
    const userId = req.user?.id || '';
    const login = req.user?.login || '';

    const result = await this.postsService.setLikeStatus(
      userId,
      login,
      postId,
      req.body.likeStatus,
    );
    handleResult(res, result);
  }
}
