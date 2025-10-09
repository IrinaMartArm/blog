import { Response, Request } from 'express';
import { createQuery } from '../../../utils/createDefaultQuery';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';
import {
  handleResult,
  handleSuccessResult,
} from '../../../core/resultCode/result-code';

const defaultQuery = createDefaultQuery({});

export const getPostsHandler = async (req: Request, res: Response) => {
  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } =
    await postsQueryRepository.getAllPosts(searchQuery);

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
