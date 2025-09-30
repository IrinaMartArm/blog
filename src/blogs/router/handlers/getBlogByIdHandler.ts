import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { BlogViewModel } from '../../types';
import { blogMapper } from '../mappers/blogMapper';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const getBlogByIdHandler = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const blog = await blogsQueryRepository.getBlogById(id);

    if (!blog) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Blog not found' }]),
        );
      return;
    }

    const blogViewModel: BlogViewModel = blogMapper(blog);

    res.send(blogViewModel);
  } catch (e: unknown) {
    res.sendStatus(HttpStatus.InternalServerError);
  }
};
