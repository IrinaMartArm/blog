import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../../src/core';
import { Express } from 'express';
import { PostViewModel } from '../../../../src/posts/types';

export const getPostById = async (
  app: Express,
  id: string,
): Promise<PostViewModel> => {
  const resp = await request(app)
    .get(`${POSTS_PATH}/${id}`)
    .expect(HttpStatus.Ok);

  expect(resp.body);
  expect(resp.body.id).toEqual(id);

  return resp.body;
};
