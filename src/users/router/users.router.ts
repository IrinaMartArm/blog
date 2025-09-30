import { Router } from 'express';
import { createUserHandler } from './handlers/createUserHandler';
import { deleteUserHandler } from './handlers/deleteUserHandler';
import { idValidation, validationResultMiddleware } from '../../core';
import {
  authMiddleware,
  basicAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { getAllUsersHandler } from './handlers/getAllUsersHandler';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { UsersSortFields } from '../types/userInputDto';
import { userValidation } from '../validation/userInputValidation';

export const usersRouter = Router({});

usersRouter.post(
  '',
  userValidation,
  // authMiddleware,
  basicAuthMiddleware,
  validationResultMiddleware,
  createUserHandler,
);

usersRouter.get(
  '',
  queryValidationMiddleware(UsersSortFields, [
    'searchLoginTerm',
    'searchEmailTerm',
  ]),
  basicAuthMiddleware,
  validationResultMiddleware,
  getAllUsersHandler,
);

usersRouter.delete(
  '/:id',
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteUserHandler,
);
