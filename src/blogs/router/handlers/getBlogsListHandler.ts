import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';

export const getBlogsListHandler = (req: Request, res: Response) => {
  const blogsList = blogsRepository.getAllBlogs();
  res.send(blogsList);
};
