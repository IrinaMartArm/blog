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
import { CommentsQueryService } from '../../comments/services/comments.query.service';
import { jwtService } from '../../auth/applications/jwtService';

@injectable()
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryService: CommentsQueryService,
    private commentsService: CommentsService,
  ) {}

  async getPostsHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({});
    const searchQuery = createQuery(req.query, defaultQuery);
    const { items, totalCount } =
      await this.postsQueryRepository.getAllPosts(searchQuery);

    handleResult(
      res,
      handleSuccessResult({
        pagesCount: Math.ceil(totalCount / searchQuery.pageSize),
        page: searchQuery.pageNumber,
        pageSize: searchQuery.pageSize,
        totalCount,
        items,
      }),
    );
  }

  async getPostByIdHandler(req: Request, res: Response) {
    const id = req.params.id;

    const post = await this.postsQueryRepository.getPost(id);

    if (!post) {
      handleResult(res, handleNotFoundResult());
      return;
    }

    handleResult(res, handleSuccessResult(post));
  }

  async createPostHandler(req: Request, res: Response) {
    const postId = await this.postsService.createPost(req.body);

    const post = await this.postsQueryRepository.getPost(postId.id);

    if (!post) {
      handleNotFoundResult();
    }

    handleResult(res, handleSuccessResult(post));
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

    const result = await this.commentsQueryService.getPostComments(
      userId,
      postId,
      searchQuery,
    );

    return handleResult(res, result);
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

    const result = await this.commentsQueryService.getComment(
      commentId,
      user.id,
    );

    return handleResult(res, handleCreatedResult(result));
  }
}
