import { Router } from 'express';
import { HttpStatus } from '../../core';
import {
  BlogModel,
  PostModel,
  requestsCollection,
  tokenCollection,
  usersCollection,
} from '../../db/mongo.db';
import { CommentModel } from '../../comments/models/comment.model';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req, res) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    usersCollection.deleteMany(),
    CommentModel.deleteMany(),
    tokenCollection.deleteMany(),
    requestsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
