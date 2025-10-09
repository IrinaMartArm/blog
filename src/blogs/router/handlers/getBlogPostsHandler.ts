import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { PostResponseDto } from '../../../posts/types/postsViewModel';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import { createQuery } from '../../../utils/createDefaultQuery';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import {
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
} from '../../../core/resultCode/result-code';

const defaultQuery = createDefaultQuery({});

export const getBlogPostsHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsQueryRepository.getBlogById(blogId);

  if (!blog) {
    handleResult(res, handleNotFoundResult());
    return;
  }

  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } = await blogsQueryRepository.getPostsByBlogId(
    blogId,
    searchQuery,
  );

  handleResult(
    res,
    handleSuccessResult({
      pagesCount: Math.ceil(totalCount / searchQuery.pageSize),
      page: searchQuery.pageNumber,
      pageSize: searchQuery.pageSize,
      totalCount,
      items,
    }),
  );
};
