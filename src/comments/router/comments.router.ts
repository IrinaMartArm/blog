import { Router } from 'express';
import {
  authMiddleware,
  basicAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { getCommentHandler } from './handlers/getCommentsHandler';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { idValidation, validationResultMiddleware } from '../../core';
import { CommentSortFields } from '../types/inputDto';
import { deleteCommentHandler } from './handlers/deleteCommentHandler';
import { updateCommentHandler } from './handlers/updateCommentHandler';
import { commentValidation } from '../validation/comment.validation';

export const commentsRouter = Router({});

commentsRouter.get(
  '/:id',
  idValidation,
  validationResultMiddleware,
  getCommentHandler,
);

commentsRouter.put(
  '/:id',
  authMiddleware,
  idValidation,
  commentValidation,
  validationResultMiddleware,
  updateCommentHandler,
);

commentsRouter.delete(
  '/:id',
  authMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteCommentHandler,
);
