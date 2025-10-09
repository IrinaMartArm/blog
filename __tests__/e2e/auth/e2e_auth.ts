import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';
import { clearDb } from '../utils/clearDb';

describe('Auth', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    beforeAll(async () => {
      await runDB(SETTINGS.MONGO_URL);
      await clearDb(app);
    });

    it('should be able to refresh token', async () => {});
  });
});

describe('/login', () => {
  const login = 'some-user';
  const password = '123456';

  // beforeAll(async () => {
  //   await client.connect();
  //   await usersCollection.deleteMany({});
  //   const salt = await cryptoService.generateSalt();
  //   const hash = await cryptoService.generateHash(password, salt);
  //   await usersCollection.insertOne({
  //     login: login,
  //     email: 'some@email.rr',
  //     passwordHash: hash,
  //     age: 18,
  //     status: UserStatus.active,
  //   } as UserType);    });
  //
  // afterAll(() => {        client.close();    });
  //
  // it('should login user', async () => {
  //   const result = await request(app)
  //     .post('/auth/login')
  //     .send({               login,               password
  //     });
});
