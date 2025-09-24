import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { blogsService } from '../../aplication/blogs.service';

export const deleteBlogHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const blog = await blogsService.getBlogById(id);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  await blogsService.deleteBlog(id);
  res.sendStatus(HttpStatus.NoContent);
};
