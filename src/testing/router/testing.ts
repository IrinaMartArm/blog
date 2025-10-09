import { Router } from 'express';
import { HttpStatus } from '../../core';
import {
  BlogModel,
  commentsCollection,
  PostModel,
  requestsCollection,
  tokenCollection,
  usersCollection,
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req, res) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    usersCollection.deleteMany(),
    commentsCollection.deleteMany(),
    tokenCollection.deleteMany(),
    requestsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
