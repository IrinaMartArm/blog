import { Request, Response } from 'express';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import {
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
} from '../../../core/resultCode/result-code';

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = await blogsQueryRepository.getBlogById(id);

  if (!blog) {
    handleResult(res, handleNotFoundResult());
  }

  handleResult(res, handleSuccessResult(blog));
};
