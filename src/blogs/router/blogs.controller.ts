import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { BlogsService } from '../aplication/blogs.service';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import {
  handleCreatedResult,
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
} from '../../core/resultCode/result-code';
import { PostsQueryRepository } from '../../posts/repositories/postsQuery.repository';
import { createErrorMessages, HttpStatus } from '../../core';
import { createDefaultQuery } from '../../core/middlewares/validations/query_validation.middleware';
import { createQuery } from '../../utils/createDefaultQuery';
import { jwtService } from '../../auth/service/jwtService';

@injectable()
export class BlogsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async createBlogHandler(req: Request, res: Response) {
    const blogId = await this.blogsService.createBlog(req.body);
    const result = await this.blogsQueryRepository.getBlogById(blogId);
    handleResult(res, handleCreatedResult(result));
  }

  async createNewPostHandler(req: Request, res: Response) {
    const blogId = req.params.id;
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      handleResult(res, handleNotFoundResult());
      return;
    }

    const postId = await this.blogsService.createPost(
      req.body,
      blogId,
      blog.name,
    );
    const newPost = await this.postsQueryRepository.getPost(postId.id);

    handleResult(res, handleCreatedResult(newPost));
  }

  async deleteBlogHandler(req: Request, res: Response) {
    const id = req.params.id;

    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    const result = await this.blogsService.deleteBlog(id);
    handleResult(res, result);
  }

  async getBlogByIdHandler(req: Request, res: Response) {
    const id = req.params.id;

    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      handleResult(res, handleNotFoundResult());
    }

    handleResult(res, handleSuccessResult(blog));
  }

  async getBlogPostsHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({});
    const blogId = req.params.id;
    const token = req.headers.authorization;
    const userId = jwtService.getUserIdByAccessToken(token);
    const blog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!blog) {
      handleResult(res, handleNotFoundResult());
      return;
    }

    const searchQuery = createQuery(req.query, defaultQuery);
    const items = await this.postsQueryRepository.getPostsByBlogId(
      blogId,
      searchQuery,
      userId,
    );

    handleResult(res, handleSuccessResult(items));
  }

  async getBlogsListHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({
      searchNameTerm: null,
    });
    const searchQuery = createQuery(req.query, defaultQuery);
    const { items, totalCount } =
      await this.blogsQueryRepository.getAllBlogs(searchQuery);

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

  async updateBlogHandler(req: Request, res: Response) {
    const id = req.params.id;
    const blog = await this.blogsQueryRepository.getBlogById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    await this.blogsService.updateBlog(id, req.body);
    res.sendStatus(HttpStatus.NoContent);
  }
}
