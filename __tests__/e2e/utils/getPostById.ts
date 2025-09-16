import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../src/core';
import { Express } from 'express';
import { PostResponseDto } from '../../../src/posts/types';

export const getPostById = async (
  app: Express,
  id: string,
): Promise<PostResponseDto> => {
  const resp = await request(app)
    .get(`${POSTS_PATH}/${id}`)
    .expect(HttpStatus.Ok);

  expect(resp.body);
  expect(resp.body.id).toEqual(id);

  return resp.body;
};
