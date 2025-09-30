import { Express } from 'express';
import { PostInputDto } from '../../../../src/posts/types/postsInputDto';
import { getPostData } from './getPostData';
import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../../src/core';
import { generateBasicAuthToken } from '../../utils/generateToken';

export const updatePost = async (
  app: Express,
  id: string,
  postData: PostInputDto,
) => {
  const post = getPostData();
  const updatedPost = { ...post, ...postData };

  const resp = await request(app)
    .put(`${POSTS_PATH}/${id}`)
    .set('authorization', generateBasicAuthToken())
    .send(updatedPost)
    .expect(HttpStatus.NoContent);

  return resp.body;
};
