import { Router } from 'express';
import {
  getPostsHandler,
  getPostByIdHandler,
  createPostHandler,
  updatePostHandler,
  deletePostHandler,
} from './handlers';
import {
  idValidation,
  PostsSortFields,
  validationResultMiddleware,
} from '../../core';
import { newPostValidation } from '../validation';
import { authMiddleware } from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';

export const postsRouter = Router({});

postsRouter.get(
  '',
  queryValidationMiddleware(PostsSortFields),
  validationResultMiddleware,
  getPostsHandler,
);

postsRouter.get(
  '/:id',
  idValidation,
  validationResultMiddleware,
  getPostByIdHandler,
);

postsRouter.post(
  '',
  authMiddleware,
  newPostValidation,
  validationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  '/:id',
  authMiddleware,
  idValidation,
  newPostValidation,
  validationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  '/:id',
  authMiddleware,
  idValidation,
  validationResultMiddleware,
  deletePostHandler,
);
