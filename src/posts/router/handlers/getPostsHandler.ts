import { Response, Request } from 'express';
import { PostResponseDto } from '../../types';
import { postsRepository } from '../../repositories/posts.repository';

export const getPostsHandler = async (req: Request, res: Response) => {
  const blogs: PostResponseDto[] = postsRepository.getAllPosts();
  res.send(blogs);
};
