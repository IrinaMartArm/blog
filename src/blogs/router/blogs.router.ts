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
import { authMiddleware } from '../../core/middlewares/validations/auth.middleware';
import { queryValidationMiddleware } from '../../core/middlewares/validations/query_validation.middleware';
import { blogPostValidation } from '../../posts/validation';
import { getBlogPostsHandler } from './handlers/getBlogPostsHandler';
import { createNewPostHandler } from './handlers/createNewPostHandler';

export const blogRouter = Router({});

blogRouter.get(
  '',
  queryValidationMiddleware(BlogsSortFields),
  validationResultMiddleware,
  getBlogsListHandler,
);

blogRouter.post(
  '/',
  authMiddleware,
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
  authMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteBlogHandler,
);

blogRouter.put(
  '/:id',
  authMiddleware,
  idValidation,
  blogInputValidation,
  validationResultMiddleware,
  updateBlogHandler,
);

blogRouter.post(
  '/:id/posts',
  authMiddleware,
  idValidation,
  blogPostValidation,
  validationResultMiddleware,
  createNewPostHandler,
);

blogRouter.get(
  '/:id/posts',
  idValidation,
  queryValidationMiddleware(PostsSortFields),
  validationResultMiddleware,
  getBlogPostsHandler,
);
