import { Request, Response } from 'express';
import { blogsRepository } from '../../repositories/blogs.repository';
import { BlogsResponseDto } from '../../types';
import { db } from '../../../db';
import { HttpStatus } from '../../../core';

export const createBlogHandler = (req: Request, res: Response) => {
  const newBlog: BlogsResponseDto = {
    id: String(db.blogs.length ? db.posts[db.blogs.length - 1].id + 1 : 1),
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
  };

  blogsRepository.createBlog(newBlog);
  res.status(HttpStatus.Created).send(newBlog);
};
