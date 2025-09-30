import { Request, Response } from 'express';
import { blogsService } from '../../aplication/blogs.service';
import { createErrorMessages, HttpStatus } from '../../../core';
import { postMapper } from '../../../posts/router/mappers/postMapper';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

export const createNewPostHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsQueryRepository.getBlogById(blogId);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const post = await blogsService.createPost(req.body, blogId, blog.name);
  const mappedPost = postMapper(post);

  return res.status(HttpStatus.Created).send(mappedPost);
};
