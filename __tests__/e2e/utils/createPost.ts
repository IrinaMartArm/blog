import { PostResponseDto } from '../../../src/posts/types';
import { Express } from 'express';
import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../src/core';
import { PostInputDto } from '../../../src/posts/dto';
import { getPostData } from './getPostData';
import { generateBasicAuthToken } from '../posts/e2e_posts';

export const createdPost = async (
  app: Express,
  newPost?: PostInputDto,
): Promise<PostResponseDto> => {
  const defaultPost = getPostData();

  const post = { ...defaultPost, ...newPost };

  const respPost = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(post)
    .expect(HttpStatus.Created);

  return respPost.body;
};
