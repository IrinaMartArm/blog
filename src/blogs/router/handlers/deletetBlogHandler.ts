import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { createErrorMessages, HttpStatus } from '../../../core';

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = await blogsRepository.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  await blogsRepository.deleteBlog(id);
  res.sendStatus(HttpStatus.NoContent);
};
