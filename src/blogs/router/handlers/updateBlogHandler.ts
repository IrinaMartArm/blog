import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { createErrorMessages, HttpStatus } from '../../../core';

export const updateBlogHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await blogsRepository.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  await blogsRepository.updateBlog(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};
