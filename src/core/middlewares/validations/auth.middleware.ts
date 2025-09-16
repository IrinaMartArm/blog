import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types';

export const USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'];

  if (!auth) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [type, token] = auth.split(' ');

  if (type !== 'basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username !== USERNAME || password !== PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  next();
};
