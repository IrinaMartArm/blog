import { Express } from 'express';
import request from 'supertest';
import {
  EMAIL,
  PASSWORD,
  USERNAME,
} from '../../../src/core/middlewares/validations/auth.middleware';
import { HttpStatus, USERS_PATH } from '../../../src/core';

const defaultUser = {
  login: USERNAME,
  email: EMAIL,
  password: 'Password123',
};

export const createUser = async (app: Express) => {
  const resp = await request(app)
    .post(USERS_PATH)
    .auth(USERNAME, PASSWORD)
    .send(defaultUser)
    .expect(HttpStatus.Created);

  return resp.body;
};
