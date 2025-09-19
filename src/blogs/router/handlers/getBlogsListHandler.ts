import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { blogMapper } from '../mappers/blogMapper';

export const getBlogsListHandler = async (req: Request, res: Response) => {
  const blogsList = await blogsRepository.getAllBlogs();
  const blogsViewModel = blogsList.map((blog) => blogMapper(blog));
  res.send(blogsViewModel);
};
