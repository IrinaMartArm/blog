import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { clearDb } from '../utils/clearDb';
import { getBlogData } from './utils/getBlogData';
import { createBlog } from './utils/createBlog';
import request from 'supertest';
import { BLOGS_PATH, HttpStatus } from '../../../src/core';
import { generateBasicAuthToken } from '../utils/generateToken';
import { runDB } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';

describe('Blogs', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it(`should create blog, POST`, async () => {
    const blog = getBlogData();

    const newBlog = {
      ...blog,
      name: 'New name',
    };

    await createBlog(app, newBlog);
  });

  it(`should get allBlogs, GET`, async () => {
    await createBlog(app);
    await createBlog(app);

    const resp = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(resp.body).toBeInstanceOf(Array);
    expect(resp.body.length).toBe(2);
  });

  it(`should get blog by id, GET/:ID`, async () => {
    const blog = await createBlog(app);
    await createBlog(app);

    const resp = await request(app)
      .get(`${BLOGS_PATH}/${blog.id}`)
      .expect(HttpStatus.Ok);

    expect(resp.body).toEqual({
      ...blog,
      id: expect.any(String),
      createdAt: expect.any(String),
    });
  });

  it(`should delete blog by id, DELETE/:ID`, async () => {
    const blog = await createBlog(app);
    await createBlog(app);

    await request(app)
      .delete(`${BLOGS_PATH}/${blog.id}`)
      .set('authorization', generateBasicAuthToken())
      .expect(HttpStatus.NoContent);

    const blogs = await request(app).get(BLOGS_PATH).expect(HttpStatus.Ok);

    expect(blogs.body).toBeInstanceOf(Array);
    expect(blogs.body.length).toBe(1);
  });
});
