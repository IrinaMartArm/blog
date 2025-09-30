import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { blogsService } from '../../aplication/blogs.service';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = await blogsQueryRepository.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  await blogsService.deleteBlog(id);
  res.sendStatus(HttpStatus.NoContent);
};
