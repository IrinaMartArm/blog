import { Router } from 'express';
import { HttpStatus } from '../../core';
import {
  BlogModel,
  requestsCollection,
  usersCollection,
} from '../../db/mongo.db';
import { CommentModel } from '../../comments/models/comment.model';
import { PostModel } from '../../posts/entity/posts.Model';
import { RefreshTokenModel } from '../../auth/entity/token';

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req, res) => {
  await Promise.all([
    BlogModel.deleteMany(),
    PostModel.deleteMany(),
    usersCollection.deleteMany(),
    CommentModel.deleteMany(),
    RefreshTokenModel.deleteMany(),
    requestsCollection.deleteMany(),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
