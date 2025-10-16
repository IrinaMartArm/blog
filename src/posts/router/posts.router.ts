import { Router } from 'express';
import {
  idValidation,
  PostsSortFields,
  validationResultMiddleware,
} from '../../core';
import { newPostValidation } from '../../core/validation';
import {
  authMiddleware,
  basicAuthMiddleware,
  optionalAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { CommentSortFields } from '../../comments/models/inputDto';
import {
  commentValidation,
  likeStatusValidation,
} from '../../comments/validation/comment.validation';
import { container } from '../../compositionRoot';
import { PostsController } from './postsController';

export const postsRouter = Router({});

const postsController = container.resolve(PostsController);

postsRouter.get(
  '',
  queryValidationMiddleware(PostsSortFields, []),
  validationResultMiddleware,
  postsController.getPostsHandler.bind(postsController),
);

postsRouter.get(
  '/:id',
  idValidation,
  optionalAuthMiddleware,
  validationResultMiddleware,
  postsController.getPostByIdHandler.bind(postsController),
);

postsRouter.post(
  '',
  basicAuthMiddleware,
  newPostValidation,
  validationResultMiddleware,
  postsController.createPostHandler.bind(postsController),
);

postsRouter.put(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  newPostValidation,
  validationResultMiddleware,
  postsController.updatePostHandler.bind(postsController),
);

postsRouter.delete(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  postsController.deletePostHandler.bind(postsController),
);

postsRouter.put(
  '/:id/like-status',
  authMiddleware,
  idValidation,
  likeStatusValidation,
  validationResultMiddleware,
  postsController.setLikeStatusesHandler.bind(postsController),
);

postsRouter.post(
  '/:id/comments',
  authMiddleware,
  idValidation,
  commentValidation,
  validationResultMiddleware,
  postsController.createCommentHandler.bind(postsController),
);

postsRouter.get(
  '/:id/comments',
  optionalAuthMiddleware,
  idValidation,
  queryValidationMiddleware(CommentSortFields, []),
  validationResultMiddleware,
  postsController.getPostCommentsHandler.bind(postsController),
);
