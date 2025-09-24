import { Request, Response } from 'express';
import { blogsMapper } from '../mappers/blogMapper';
import { blogsService } from '../../aplication/blogs.service';
import { defaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { BlogsQueryInput } from '../../../core';

export const createQuery = (
  query: Partial<BlogsQueryInput>,
): BlogsQueryInput => {
  return {
    ...defaultQuery,
    ...query,
    sortBy: (query.sortBy ?? defaultQuery.sortBy) as string,
    searchNameTerm: query.searchNameTerm ?? null,
    pageSize: query.pageSize ? +query.pageSize : defaultQuery.pageSize,
    pageNumber: query.pageNumber ? +query.pageNumber : defaultQuery.pageNumber,
  };
};

export const getBlogsListHandler = async (
  // req: Request<{}, {}, {}, BlogsQueryInput>,
  req: Request,
  res: Response,
) => {
  const searchQuery = createQuery(req.query);
  const { items, totalCount } = await blogsService.getAllBlogs(searchQuery);

  const blogsViewModel = blogsMapper(
    items,
    searchQuery.pageNumber,
    searchQuery.pageSize,
    totalCount,
  );
  res.send(blogsViewModel);
};
