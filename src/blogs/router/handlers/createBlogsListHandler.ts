import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogResponseDto } from '../../types';
import { HttpStatus } from '../../../core';
import { blogMapper } from '../mappers/blogMapper';

export const createBlogHandler = async (req: Request, res: Response) => {
  const newBlog: BlogResponseDto = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    isMembership: false,
    createdAt: new Date().toISOString(),
  };

  const blog = await blogsRepository.createBlog(newBlog);
  res.status(HttpStatus.Created).send(blogMapper(blog));
};
