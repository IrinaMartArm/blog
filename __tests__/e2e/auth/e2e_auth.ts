import express, { Express } from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';
import { clearDb } from '../utils/clearDb';
import request from 'supertest';
import { NodemailerService } from '../../../src/auth/service/nodemailerService';
import { container } from '../../../src/compositionRoot';
import { createUser } from '../utils/createUser';
import { login } from '../utils/login';

describe('/auth', () => {
  let app: Express;
  let sendEmailSpy: jest.SpyInstance;

  beforeAll(async () => {
    app = express();

    // Получаем экземпляр, который уже в контейнере
    const nodemailerService = container.get(NodemailerService);

    // СТАВИМ spy ДО setupApp
    sendEmailSpy = jest
      .spyOn(nodemailerService, 'sendEmail')
      .mockResolvedValue(true);

    setupApp(app);

    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it('POST /auth/registration calls sendEmail', async () => {
    await request(app)
      .post('/auth/registration')
      .send({
        login: 'user1',
        password: '123456',
        email: 'user1@mail.com',
      })
      .expect(204);

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/login', async () => {
    await createUser(app);
    await login(app);
  });

  it('should confirm email', async () => {
    await createUser(app);
    await login(app);
  });
});
