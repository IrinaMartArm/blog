import { Request, Response } from 'express';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { createQuery } from '../../../utils/createDefaultQuery';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import {
  handleResult,
  handleSuccessResult,
} from '../../../core/resultCode/result-code';

const defaultQuery = createDefaultQuery({
  searchNameTerm: null,
});

export const getBlogsListHandler = async (req: Request, res: Response) => {
  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } =
    await blogsQueryRepository.getAllBlogs(searchQuery);

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
