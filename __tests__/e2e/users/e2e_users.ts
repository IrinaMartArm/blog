import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';
import { clearDb } from '../utils/clearDb';
import { createUser } from './utils/createUser';

describe('Users', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it(`should create user, POST`, async () => {
    await createUser(app);
  });

  it(`should create user, POST`, async () => {});
});
