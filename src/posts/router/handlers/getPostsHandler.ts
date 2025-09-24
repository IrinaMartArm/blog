import { Response, Request } from 'express';
import { PostResponseDto } from '../../types';
import { postsMapper } from '../mappers/postMapper';
import { postsService } from '../../aplication/posts.service';
import { createQuery } from '../../../blogs/router/handlers/getBlogsListHandler';

export const getPostsHandler = async (req: Request, res: Response) => {
  const searchQuery = createQuery(req.query);
  const { items, totalCount } = await postsService.getAllPosts(searchQuery);

  const postsViewModel: PostResponseDto = postsMapper(
    items,
    totalCount,
    searchQuery.pageNumber,
    searchQuery.pageSize,
  );

  res.send(postsViewModel);
};
