import { Router } from 'express';
import { HttpStatus } from '../../core';
import {
  blogsCollection,
  commentsCollection,
  postsCollection,
  requestsCollection,
  tokenCollection,
  usersCollection,
} from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req, res) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
    usersCollection.deleteMany(),
    commentsCollection.deleteMany(),
    tokenCollection.deleteMany(),
    requestsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
