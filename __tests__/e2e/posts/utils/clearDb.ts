import { Express } from 'express';
import request from 'supertest';
import { HttpStatus, TESTING_PATH } from '../../../src/core';

export const clearDb = async (app: Express) => {
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .expect(HttpStatus.NoContent);
};
