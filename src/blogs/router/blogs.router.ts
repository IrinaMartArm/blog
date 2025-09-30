import { Router } from 'express';
import { getBlogsListHandler } from './handlers/getBlogsListHandler';
import { createBlogHandler } from './handlers/createBlogsListHandler';
import {
  BlogsSortFields,
  idValidation,
  PostsSortFields,
  validationResultMiddleware,
} from '../../core';
import { blogInputValidation } from '../validation';
import { getBlogByIdHandler } from './handlers/getBlogByIdHandler';
import { deleteBlogHandler } from './handlers/deletetBlogHandler';
import { updateBlogHandler } from './handlers/updateBlogHandler';
import {
  authMiddleware,
  basicAuthMiddleware,
} from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { blogPostValidation } from '../../core/validation';
import { getBlogPostsHandler } from './handlers/getBlogPostsHandler';
import { createNewPostHandler } from './handlers/createNewPostHandler';

export const blogRouter = Router({});

blogRouter.get(
  '',
  queryValidationMiddleware(BlogsSortFields, ['searchNameTerm']),
  validationResultMiddleware,
  getBlogsListHandler,
);

blogRouter.post(
  '/',
  // authMiddleware,
  basicAuthMiddleware,
  blogInputValidation,
  validationResultMiddleware,
  createBlogHandler,
);

blogRouter.get(
  '/:id',
  idValidation,
  validationResultMiddleware,
  getBlogByIdHandler,
);

blogRouter.delete(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteBlogHandler,
);

blogRouter.put(
  '/:id',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  blogInputValidation,
  validationResultMiddleware,
  updateBlogHandler,
);

blogRouter.post(
  '/:id/posts',
  // authMiddleware,
  basicAuthMiddleware,
  idValidation,
  blogPostValidation,
  validationResultMiddleware,
  createNewPostHandler,
);

blogRouter.get(
  '/:id/posts',
  idValidation,
  queryValidationMiddleware(PostsSortFields, []),
  validationResultMiddleware,
  getBlogPostsHandler,
);
