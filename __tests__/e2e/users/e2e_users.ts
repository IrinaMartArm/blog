import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';
import { clearDb } from '../utils/clearDb';
import { createUser } from '../utils/createUser';
import { getUsers } from '../utils/getUsers';
import request from 'supertest';
import { HttpStatus, USERS_PATH } from '../../../src/core';
import { generateBasicAuthToken } from '../utils/generateToken';

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

  it(`should get user, GET`, async () => {
    await createUser(app);
    // const result = await request(app)
    //   .get(USERS_PATH)
    //   .set('authorization', generateBasicAuthToken())
    //   .expect(HttpStatus.Ok);

    const result = await getUsers(app);

    expect(result.body.items).toBeInstanceOf(Array);
    expect(result.body.items.length).toBe(1);
  });

  it(`should delete user, DELETE`, async () => {
    const user = await createUser(app);

    await request(app)
      .delete(`${USERS_PATH}/${user.id}`)
      .set('authorization', generateBasicAuthToken())
      .expect(HttpStatus.NoContent);

    const result = await getUsers(app);

    expect(result.body.items).toBeInstanceOf(Array);
    expect(result.body.items.length).toBe(0);
  });
});
