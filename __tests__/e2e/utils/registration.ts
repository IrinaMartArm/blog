import { Express } from 'express';
import request from 'supertest';
import { AUTH_PATH, HttpStatus } from '../../../src/core';
import {
  EMAIL,
  USERNAME,
} from '../../../src/core/middlewares/validations/auth.middleware';

export const registration = async (app: Express) => {
  const resp = await request(app)
    .post(`${AUTH_PATH}/registration`)
    .send({
      login: USERNAME,
      password: 'Password123',
      email: EMAIL,
    })
    .expect(HttpStatus.NoContent);

  return resp.body;
};
