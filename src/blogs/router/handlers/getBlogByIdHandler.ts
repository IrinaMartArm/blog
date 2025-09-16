import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { createErrorMessages, HttpStatus } from '../../../core';

export const getBlogByIdHandler = (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = blogsRepository.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }
  res.send(blog);
};
