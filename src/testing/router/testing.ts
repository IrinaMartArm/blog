import { Router } from 'express';
import { db } from '../../db';
import { HttpStatus } from '../../core';

export const testingRouter = Router({});

testingRouter.delete('/all-data', (req, res) => {
  db.posts = [];
  db.blogs = [];
  res.status(HttpStatus.NoContent);
});
