import { Express } from 'express';
import request from 'supertest';
import { HttpStatus, USERS_PATH } from '../../../src/core';
import { generateBasicAuthToken } from './generateToken';

export const getUsers = async (app: Express) => {
  return request(app)
    .get(USERS_PATH)
    .set('authorization', generateBasicAuthToken())
    .expect(HttpStatus.Ok);
};
