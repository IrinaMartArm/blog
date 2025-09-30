import { Request, Response } from 'express';
import { blogsMapper } from '../mappers/blogMapper';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { createQuery } from '../../../utils/createDefaultQuery';
import { BlogsQueryInput } from '../../../core';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';

const defaultQuery = createDefaultQuery({
  searchNameTerm: null,
});

export const getBlogsListHandler = async (req: Request, res: Response) => {
  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } =
    await blogsQueryRepository.getAllBlogs(searchQuery);

  const blogsViewModel = blogsMapper(
    items,
    searchQuery.pageNumber,
    searchQuery.pageSize,
    totalCount,
  );
  res.send(blogsViewModel);
};
