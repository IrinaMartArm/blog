import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { getPostData } from '../utils/getPostData';
import { clearDb } from '../utils/clearDb';
import { createdPost } from '../utils/createPost';
import { HttpStatus, POSTS_PATH } from '../../../src/core';
import request from 'supertest';
import { getAllPosts } from '../utils/getAllPosts';
import { getPostById } from '../utils/getPostById';
import { updatePost } from '../utils/updatePost';
import {
  PASSWORD,
  USERNAME,
} from '../../../src/core/middlewares/validations/auth.middleware';

export function generateBasicAuthToken() {
  const credentials = `${USERNAME}:${PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
}

describe('Posts', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    clearDb(app);
  });

  it(`should create post, POST`, async () => {
    const post = getPostData();

    const newPost = {
      ...post,
      title: 'new title',
    };

    await createdPost(app, newPost);
  });

  it(`should get all posts, GET`, async () => {
    await createdPost(app);
    await createdPost(app);

    await getAllPosts(app);
  });

  it(`should get post by id, GET/:ID`, async () => {
    const post = await createdPost(app);
    await createdPost(app);

    await getPostById(app, post.id);
  });

  it(`should delete post by id`, async () => {
    const post = await createdPost(app);
    await createdPost(app);

    await request(app)
      .delete(`${POSTS_PATH}/${post.id}`)
      .set('Authorization', generateBasicAuthToken())
      .expect(HttpStatus.NoContent);

    const postsList = await getAllPosts(app);

    expect(postsList).toBeInstanceOf(Array);
    expect(postsList.length).toBeGreaterThanOrEqual(1);
  });

  it(`should update post by id`, async () => {
    const post = await createdPost(app);
    await createdPost(app);

    const updateData = {
      title: 'new title',
      shortDescription: 'new shortDescription',
      content: 'content',
      blogId: post.blogId,
    };

    await updatePost(app, post.id, updateData);

    const updatedPost = await getPostById(app, post.id);

    expect(updatedPost).toEqual({
      ...updateData,
      id: post.id,
      blogName: expect.any(String),
    });
  });
});
