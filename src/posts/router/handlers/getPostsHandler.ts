import { Response, Request } from 'express';
import { PostResponseDto } from '../../types/postsViewModel';
import { postsMapper } from '../mappers/postMapper';
import { postsService } from '../../services/posts.service';
import { createQuery } from '../../../utils/createDefaultQuery';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';

const defaultQuery = createDefaultQuery({});

export const getPostsHandler = async (req: Request, res: Response) => {
  const searchQuery = createQuery(req.query, defaultQuery);
  const { items, totalCount } =
    await postsQueryRepository.getAllPosts(searchQuery);

  const postsViewModel: PostResponseDto = postsMapper(
    items,
    totalCount,
    searchQuery.pageNumber,
    searchQuery.pageSize,
  );

  res.send(postsViewModel);
};
