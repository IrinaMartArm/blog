import mongoose from 'mongoose';
import request from 'supertest';
import express from 'express';
import { createBlog } from '../utils/createBlog';
import { SETTINGS } from '../../../src/core/settings';
import { setupApp } from '../../../src/setup-app';
import { clearDb } from '../utils/clearDb';
import { runDB } from '../../../src/db/mongo.db';

describe('Mongoose integration', () => {
  // const mongoURI = 'mongodb://0.0.0.0:27017/home_works';
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await clearDb(app);
  });

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  // beforeAll(async () => {
  //   /* Connecting to the database. */
  //   await mongoose.connect(SETTINGS.MONGO_URL);
  // });
  //
  // afterAll(async () => {
  //   /* Closing database connection after each test. */
  //   await mongoose.connection.close();
  // });

  it('+ GET blogs', async () => {
    await createBlog(app);

    const res_ = await request(app).get('/blogs').expect(200);
    expect(res_.body.items.length).toBe(1);
  });
});
