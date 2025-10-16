import { Router } from 'express';
import {
  BlogsSortFields,
  idValidation,
  PostsSortFields,
  validationResultMiddleware,
} from '../../core';
import { blogInputValidation } from '../validation';
import { basicAuthMiddleware } from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { blogPostValidation } from '../../core/validation';
import { container } from '../../compositionRoot';
import { BlogsController } from './blogs.controller';

export const blogRouter = Router({});

const blogsController = container.resolve(BlogsController);

blogRouter.get(
  '',
  queryValidationMiddleware(BlogsSortFields, ['searchNameTerm']),
  validationResultMiddleware,
  blogsController.getBlogsListHandler.bind(blogsController),
);

blogRouter.post(
  '/',
  basicAuthMiddleware,
  blogInputValidation,
  validationResultMiddleware,
  blogsController.createBlogHandler.bind(blogsController),
);

blogRouter.get(
  '/:id',
  idValidation,
  validationResultMiddleware,
  blogsController.getBlogByIdHandler.bind(blogsController),
);

blogRouter.delete(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  blogsController.deleteBlogHandler.bind(blogsController),
);

blogRouter.put(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  blogInputValidation,
  validationResultMiddleware,
  blogsController.updateBlogHandler.bind(blogsController),
);

blogRouter.post(
  '/:id/posts',
  basicAuthMiddleware,
  idValidation,
  blogPostValidation,
  validationResultMiddleware,
  blogsController.createNewPostHandler.bind(blogsController),
);

blogRouter.get(
  '/:id/posts',
  idValidation,
  queryValidationMiddleware(PostsSortFields, []),
  validationResultMiddleware,
  blogsController.getBlogPostsHandler.bind(blogsController),
);
