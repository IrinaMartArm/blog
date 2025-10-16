import express, { Express } from 'express';
import { setupApp } from '../../../src/setup-app';
import { runDB, usersCollection } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/core/settings';
import { clearDb } from '../utils/clearDb';
import { NodemailerService } from '../../../src/auth/service/nodemailerService';
import { container } from '../../../src/compositionRoot';
import { createUser } from '../utils/createUser';
import { login } from '../utils/login';
import { registration } from '../utils/registration';
import { EMAIL } from '../../../src/core/middlewares/validations/auth.middleware';
import request from 'supertest';
import { AUTH_PATH, HttpStatus } from '../../../src/core';

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
    await registration(app);

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/login', async () => {
    await createUser(app);
    await login(app);
  });

  it('should confirm email', async () => {
    await registration(app);
    const userInDb = await usersCollection.findOne({ email: EMAIL });
    expect(userInDb).not.toBeNull();

    const code = userInDb!.emailConfirmation.confirmationCode;
    expect(code).toBeDefined();

    request(app)
      .post(`${AUTH_PATH}/registration-confirmation`)
      .send({ code })
      .expect(HttpStatus.NoContent);
  });

  it('POST /auth/registration-email-resending', async () => {
    await registration(app);

    request(app)
      .post(`${AUTH_PATH}/registration-email-resending`)
      .send({ email: EMAIL })
      .expect(HttpStatus.NoContent);

    expect(sendEmailSpy).toHaveBeenCalledTimes(1);
  });

  it('POST /auth/logout', async () => {
    await createUser(app);
    await login(app);

    request(app).post(`${AUTH_PATH}/logout`).expect(HttpStatus.NoContent);
  });
});
