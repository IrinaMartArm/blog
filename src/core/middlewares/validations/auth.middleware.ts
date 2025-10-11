import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../../auth/applications/jwtService';
import { usersQueryRepository } from '../../../users/repositories/users.query.repository';
import {
  handleResult,
  handleUnauthorizedResult,
} from '../../resultCode/result-code';

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
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const [type, token] = auth.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const payload = jwtService.verifyToken(token);

  if (!payload) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const user = await usersQueryRepository.getUserById(payload.userId);
  if (!user) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }
  req.user = {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
  };

  next();
};

export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await jwtService.verifyToken(token);
    if (payload) {
      req.user = { id: payload.id, login: payload.login, email: payload.email };
    }
  } catch (e) {
    // токен невалидный → просто считаем, что пользователь не залогинен
  }

  return next();
}

export const basicAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const [type, token] = authHeader.split(' ');

  if (type.toLowerCase() !== 'basic') {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');

  const [username, password] = credentials.split(':');

  if (username !== USERNAME || password !== PASSWORD) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  next();
};
