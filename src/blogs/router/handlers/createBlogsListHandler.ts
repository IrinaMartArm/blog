import { Request, Response } from 'express';
import { HttpStatus } from '../../../core';
import { blogMapper } from '../mappers/blogMapper';
import { blogsService } from '../../aplication/blogs.service';

export const createBlogHandler = async (req: Request, res: Response) => {
  const blog = await blogsService.createBlog(req.body);
  res.status(HttpStatus.Created).send(blogMapper(blog));
};
