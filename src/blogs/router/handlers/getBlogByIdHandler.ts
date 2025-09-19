import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { createErrorMessages, HttpStatus } from '../../../core';
import { blogMapper } from '../mappers/blogMapper';

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const blog = await blogsRepository.getBlogById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    const blogViewModel = blogMapper(blog);
    res.send(blogViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
