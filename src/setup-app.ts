import express, { Express } from 'express';
import { blogRouter } from './blogs/router/blogs.router';
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  SECURITY_PATH,
  TESTING_PATH,
  USERS_PATH,
} from './core';
import { postsRouter } from './posts/router/posts.router';
import { testingRouter } from './testing/router/testing';
import { authRouter } from './auth/router/auth.router';
import { usersRouter } from './users/router/users.router';
import { commentsRouter } from './comments/router/comments.router';
import cookieParser from 'cookie-parser';
import { securityRouter } from './sessions/router/sessions.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.set('trust proxy', true);
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(AUTH_PATH, authRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(BLOGS_PATH, blogRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(COMMENTS_PATH, commentsRouter);
  app.use(SECURITY_PATH, securityRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
