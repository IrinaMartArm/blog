import { Router } from 'express';
import {
  authMiddleware,
  optionalAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { IdValidation, validationResultMiddleware } from '../../core';
import {
  commentValidation,
  likeStatusValidation,
} from '../validation/comment.validation';
import { container } from '../../compositionRoot';
import { CommentsController } from './commentsController';

export const commentsRouter = Router({});

const commentsController = container.resolve(CommentsController);

commentsRouter.get(
  '/:id',
  IdValidation,
  validationResultMiddleware,
  commentsController.getCommentHandler.bind(commentsController),
);

commentsRouter.put(
  '/:id',
  authMiddleware,
  IdValidation,
  commentValidation,
  validationResultMiddleware,
  commentsController.updateCommentHandler.bind(commentsController),
);

commentsRouter.delete(
  '/:id',
  authMiddleware,
  IdValidation,
  validationResultMiddleware,
  commentsController.deleteCommentHandler.bind(commentsController),
);

commentsRouter.put(
  '/:id/like-status',
  authMiddleware,
  likeStatusValidation,
  IdValidation,
  validationResultMiddleware,
  commentsController.setLikeStatusesHandler.bind(commentsController),
);
