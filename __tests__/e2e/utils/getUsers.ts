import request from 'supertest';
import { HttpStatus, USERS_PATH } from '../../../src/core';
import { generateBasicAuthToken } from './generateToken';
import { Express } from 'express';

export const getUsers = async (app: Express) => {
  const resp = await request(app)
    .get(USERS_PATH)
    .set('authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);

  return resp.body;
};
