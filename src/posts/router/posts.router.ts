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
import { newPostValidation } from '../../core/validation';
import {
  authMiddleware,
  basicAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { createCommentHandler } from './handlers/createCommentHandler';
import { CommentSortFields } from '../../comments/types/inputDto';
import { getPostCommentsHandler } from './handlers/getPostCommentsHandler';
import { commentValidation } from '../../comments/validation/comment.validation';

export const postsRouter = Router({});

postsRouter.get(
  '',
  queryValidationMiddleware(PostsSortFields, []),
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
  basicAuthMiddleware,
  newPostValidation,
  validationResultMiddleware,
  createPostHandler,
);

postsRouter.put(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  newPostValidation,
  validationResultMiddleware,
  updatePostHandler,
);

postsRouter.delete(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  deletePostHandler,
);

postsRouter.post(
  '/:id/comments',
  authMiddleware,
  idValidation,
  commentValidation,
  validationResultMiddleware,
  createCommentHandler,
);

postsRouter.get(
  '/:id/comments',
  idValidation,
  queryValidationMiddleware(CommentSortFields, []),
  validationResultMiddleware,
  getPostCommentsHandler,
);
