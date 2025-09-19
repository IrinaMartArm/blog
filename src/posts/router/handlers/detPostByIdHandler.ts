import { Response, Request } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { createErrorMessages, HttpStatus } from '../../../core';
import { postMapper } from '../mappers/postMapper';
import { PostViewModel } from '../../types';

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsRepository.getPost(id);

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
  const newPost = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: 'some name',
    createdAt: new Date().toISOString(),
  };

  const post = await postsRepository.createPost(newPost);
  const mappedPost = postMapper(post);

  res.status(HttpStatus.Created).send(mappedPost);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  await postsRepository.updatePost(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  await postsRepository.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
};
