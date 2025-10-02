import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../types';
import { jwtService } from '../../../auth/applications/jwtService';
import { usersQueryRepository } from '../../../users/repositories/users.query.repositiry';

export const USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';
export const ADMIN_TOKEN =
  'Basic ' + Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

export const authMiddleware = async (
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

  if (type.toLowerCase() !== 'bearer') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const payload = jwtService.verifyToken(token);

  if (!payload) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const user = await usersQueryRepository.getUserById(payload.userId);
  if (!user) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }
  req.user = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
  };

  next();
};

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const [type, token] = authHeader.split(' ');

  if (type.toLowerCase() !== 'basic') {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username !== USERNAME || password !== PASSWORD) {
    res.sendStatus(HttpStatus.Unauthorized);
    return;
  }

  // Правильный заголовок: "Basic YWRtaW46cXdlcnR5" (это admin:qwerty в base64)
  // const expectedAuth =
  //   'Basic ' + Buffer.from('admin:qwerty').toString('base64');
  //
  // if (!authHeader || authHeader !== expectedAuth) {
  //   return res.sendStatus(401);
  // }
  //
  next();
};
