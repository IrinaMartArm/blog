import { Request, Response } from 'express';
import { blogsService } from '../../aplication/blogs.service';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import {
  handleCreatedResult,
  handleResult,
} from '../../../core/resultCode/result-code';

export const createBlogHandler = async (req: Request, res: Response) => {
  const blogId = await blogsService.createBlog(req.body);
  const result = await blogsQueryRepository.getBlogById(blogId.id);
  handleResult(res, handleCreatedResult(result));
};
