import { Request, Response } from 'express';
import { blogsService } from '../../aplication/blogs.service';
import { createErrorMessages, HttpStatus } from '../../../core';
import { createQuery } from './getBlogsListHandler';
import { PostResponseDto } from '../../../posts/types';
import { postsMapper } from '../../../posts/router/mappers/postMapper';

export const getBlogPostsHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsService.getBlogById(blogId);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const searchQuery = createQuery(req.query);
  const { items, totalCount } = await blogsService.getPostsByBlogId(
    blogId,
    searchQuery,
  );

  const postsViewModel: PostResponseDto = postsMapper(
    items,
    totalCount,
    searchQuery.pageNumber,
    searchQuery.pageSize,
  );

  return res.status(HttpStatus.Ok).send(postsViewModel);
};
