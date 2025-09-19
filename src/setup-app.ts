import express, { Express } from 'express';
import { blogRouter } from './blogs/router/blogs.router';
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from './core';
import { postsRouter } from './posts/router/posts.router';
import { testingRouter } from './testing/router/testing';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(BLOGS_PATH, blogRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);

  return app;
};
