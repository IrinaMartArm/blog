import request from 'supertest';
import { BLOGS_PATH, HttpStatus } from '../../../src/core';
import { generateBasicAuthToken } from './generateToken';
import { Express } from 'express';
import { BlogInputDto } from '../../../src/blogs/dto';
import { getBlogData } from '../blogs/utils/getBlogData';
import { BlogViewModel } from '../../../src/blogs/types';

export const createBlog = async (
  app: Express,
  newBlog?: BlogInputDto,
): Promise<BlogViewModel> => {
  const defaultBlog = getBlogData();
  const blog = {
    ...defaultBlog,
    ...newBlog,
  };

  const resp = await request(app)
    .post(BLOGS_PATH)
    .set('authorization', generateBasicAuthToken())
    .send(blog)
    .expect(HttpStatus.Created);

  return resp.body;
};
