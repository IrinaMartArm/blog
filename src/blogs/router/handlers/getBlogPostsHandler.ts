import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { PostResponseDto } from '../../../posts/types/postsViewModel';
import { postsMapper } from '../../../posts/router/mappers/postMapper';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import { createQuery } from '../../../utils/createDefaultQuery';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';

const defaultQuery = createDefaultQuery({});

export const getBlogPostsHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsQueryRepository.getBlogById(blogId);

  if (!blog) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Blog not found' }]));
    return;
  }

  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } = await blogsQueryRepository.getPostsByBlogId(
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
