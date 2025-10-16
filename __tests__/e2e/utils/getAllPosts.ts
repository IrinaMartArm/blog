import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../src/core';
import { Express } from 'express';
import { PostViewModel } from '../../../src/posts/types/postsViewModel';

export const getAllPosts = async (app: Express): Promise<PostViewModel[]> => {
  const resp = await request(app).get(POSTS_PATH).expect(HttpStatus.Ok);

  expect(resp.body.items).toBeInstanceOf(Array);
  expect(resp.body.items.length).toBeGreaterThanOrEqual(2);

  return resp.body;
};
