import { Response, Request } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { createErrorMessages, HttpStatus } from '../../../core';
import { db } from '../../../db';

export const getPostByIdHandler = (req: Request, res: Response) => {
  const id = req.params.id;

  const post = postsRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  res.send(post);
};

export const createPostHandler = (req: Request, res: Response) => {
  const newPost = {
    id: String(db.posts.length ? db.posts[db.posts.length - 1].id + 1 : 1),
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: 'some name',
  };

  postsRepository.createPost(newPost);
  res.status(HttpStatus.Created).send(newPost);
};

export const updatePostHandler = (req: Request, res: Response) => {
  const id = req.params.id;

  const post = postsRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  postsRepository.updatePost(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};

export const deletePostHandler = (req: Request, res: Response) => {
  const id = req.params.id;

  const post = postsRepository.getPost(id);
  if (!post) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'Post not found' }]));
    return;
  }

  postsRepository.deletePost(id);
  res.sendStatus(HttpStatus.NoContent);
};
