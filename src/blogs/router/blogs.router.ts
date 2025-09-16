import { Router } from 'express';
import { getBlogsListHandler } from './handlers/getBlogsListHandler';
import { createBlogHandler } from './handlers/createBlogsListHandler';
import { idValidation, validationResultMiddleware } from '../../core';
import { blogInputValidation } from '../validation';
import { getBlogByIdHandler } from './handlers/getBlogByIdHandler';
import { deleteBlogHandler } from './handlers/deletetBlogHandler';
import { updateBlogHandler } from './handlers/updateBlogHandler';
import { authMiddleware } from '../../core/middlewares/validations/auth.middleware';

export const blogRouter = Router({});

blogRouter.get('', getBlogsListHandler);

blogRouter.post(
  '/',
  authMiddleware,
  blogInputValidation,
  validationResultMiddleware,
  createBlogHandler,
);

blogRouter.get(
  '/;id',
  idValidation,
  validationResultMiddleware,
  getBlogByIdHandler,
);

blogRouter.delete(
  '/;id',
  authMiddleware,
  idValidation,
  validationResultMiddleware,
  deleteBlogHandler,
);

blogRouter.put(
  '/id',
  authMiddleware,
  idValidation,
  blogInputValidation,
  validationResultMiddleware,
  updateBlogHandler,
);
