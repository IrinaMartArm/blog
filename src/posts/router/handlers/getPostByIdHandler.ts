import { Response, Request } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { postMapper } from '../mappers/postMapper';
import { PostViewModel } from '../../types/postsViewModel';
import { postsService } from '../../services/posts.service';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsQueryRepository.getPost(id);

  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }
  const postViewModel: PostViewModel = postMapper(post);
  res.send(postViewModel);
};

export const createPostHandler = async (req: Request, res: Response) => {
  const post = await postsService.createPost(req.body);
  const mappedPost = postMapper(post);

  res.status(HttpStatus.Created).send(mappedPost);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsQueryRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  await postsService.updatePost(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsQueryRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  await postsService.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
};
