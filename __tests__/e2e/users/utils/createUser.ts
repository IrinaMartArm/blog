import { Express } from 'express';
import request from 'supertest';
import {
  PASSWORD,
  USERNAME,
} from '../../../../src/core/middlewares/validations/auth.middleware';
import { HttpStatus } from '../../../../src/core';

const defaultUser = {
  login: 'test',
  email: 'test@gmail.com',
  password: 'Password123',
};

export const createUser = async (app: Express) => {
  const resp = await request(app)
    .post('/users')
    .auth(USERNAME, PASSWORD)
    .send(defaultUser)
    .expect(HttpStatus.Created);

  return resp.body;
};
