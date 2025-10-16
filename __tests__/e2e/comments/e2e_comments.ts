import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { createBlog } from '../utils/createBlog';
import { SETTINGS } from '../../../src/core/settings';

describe('Mongoose integration', () => {
  const mongoURI = 'mongodb://0.0.0.0:27017/home_works';
  const app = express();

  beforeAll(async () => {
    /* Connecting to the database. */
    await mongoose.connect(SETTINGS.MONGO_URL);
  });

  afterAll(async () => {
    /* Closing database connection after each test. */
    await mongoose.connection.close();
  });

  it('+ GET blogs', async () => {
    await createBlog(app);

    const res_ = await request(app).get('/blogs').expect(200);
    expect(res_.body.items.length).toBe(1);
  });
});
