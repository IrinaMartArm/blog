import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { blogsService } from '../../aplication/blogs.service';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const updateBlogHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsQueryRepository.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  await blogsService.updateBlog(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};
