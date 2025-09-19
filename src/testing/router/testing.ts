import { Router } from 'express';
import { HttpStatus } from '../../core';
import { blogsCollection, postsCollection } from '../../db/mongo.db';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req, res) => {
  await Promise.all([
    blogsCollection.deleteMany(),
    postsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
