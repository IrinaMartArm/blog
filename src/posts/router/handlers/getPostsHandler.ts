import { Response, Request } from 'express';
import { PostResponseDto } from '../../types';
import { postsRepository } from '../../repositories/posts.repository';
import { WithId } from 'mongodb';
import { postMapper } from '../mappers/postMapper';

export const getPostsHandler = async (req: Request, res: Response) => {
  const posts: WithId<PostResponseDto>[] = await postsRepository.getAllPosts();
  const postsViewModel = posts.map((p) => postMapper(p));

  res.send(postsViewModel);
};
