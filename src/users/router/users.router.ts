import 'reflect-metadata';
import { Request, Response, Router } from 'express';
import {
  createErrorMessages,
  HttpStatus,
  idValidation,
  validationResultMiddleware,
} from '../../core';
import { basicAuthMiddleware } from '../../core/middlewares/validations/auth.middleware';
import {
  createDefaultQuery,
  queryValidationMiddleware,
} from '../../core/middlewares/validations/query_validation.middleware';
import { UsersSortFields } from '../types/userInputDto';
import { userValidation } from '../validation/userInputValidation';
import { UsersService } from '../services/usersService';
import { usersQueryRepository } from '../repositories/users.query.repository';
import { userMapper } from '../mappers/userMapper';
import { createQuery } from '../../utils/createDefaultQuery';
import { usersMapper } from '../mappers/usersMapper';
import { injectable } from 'inversify';
import { container } from '../../auth/compositionRoot';
import { UsersController } from './userController';

export const usersRouter = Router({});

// const usersRepo = new UsersRepository();
// const userService = new UsersService(usersRepo);
// const usersController = new UsersController(userService);

const usersController = container.resolve(UsersController);

usersRouter.post(
  '',
  userValidation,
  basicAuthMiddleware,
  validationResultMiddleware,
  usersController.createUserHandler.bind(usersController),
);

usersRouter.get(
  '',
  queryValidationMiddleware(UsersSortFields, [
    'searchLoginTerm',
    'searchEmailTerm',
  ]),
  basicAuthMiddleware,
  validationResultMiddleware,
  usersController.getAllUsersHandler.bind(usersController),
);

usersRouter.delete(
  '/:id',
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  usersController.deleteUserHandler.bind(usersController),
);
