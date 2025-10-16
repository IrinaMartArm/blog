import { PostViewModel } from '../../../src/posts/types/postsViewModel';
import { Express } from 'express';
import request from 'supertest';
import { HttpStatus, POSTS_PATH } from '../../../src/core';
import { PostInputDto } from '../../../src/posts/types/postsInputDto';
import { getPostData } from '../posts/utils/getPostData';
import { generateBasicAuthToken } from './generateToken';
import { createBlog } from './createBlog';

export const createdPost = async (
  app: Express,
  newPost?: PostInputDto,
): Promise<PostViewModel> => {
  const defaultPost = getPostData();
  const blog = await createBlog(app);

  const post = { ...defaultPost, ...newPost, blogId: blog.id };

  const respPost = await request(app)
    .post(POSTS_PATH)
    .set('authorization', generateBasicAuthToken())
    .send(post)
    .expect(HttpStatus.Created);

  return respPost.body;
};
