import { Response, Request } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';
import { postMapper } from '../mappers/postMapper';
import { PostViewModel } from '../../types';
import { postsService } from '../../aplication/posts.service';

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsService.getPostById(id);

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

  const post = await postsService.getPostById(id);
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

  const post = await postsService.getPostById(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  await postsService.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
};
