import { Express } from 'express';
import request from 'supertest';
import { HttpStatus } from '../../../src/core';

const email = 'test@gmail.com';
const password = 'Password123';

export const login = async (app: Express) => {
  const resp = await request(app)
    .post('/auth/login')
    .send({ loginOrEmail: email, password })
    .expect(HttpStatus.Ok);

  return resp.body.accessToken;
};
