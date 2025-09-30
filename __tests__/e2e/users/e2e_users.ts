import express from 'express';
import { setupApp } from '../../../src/setup-app';
import { usersRepository } from '../../../src/users/repositories/users.repositiry';

describe('Users', () => {
  const app = express();
  setupApp(app);

  beforeEach(async () => {
    await usersRepository.deleteAllUsers();
  });
});
