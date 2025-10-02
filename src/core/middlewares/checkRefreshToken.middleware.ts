import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../types';
import { jwtService } from '../../auth/applications/jwtService';
import { RefreshToken } from '../../auth/types/authDbModel';

export const checkRefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const payload = jwtService.verifyToken<RefreshToken>(token);

  if (!payload) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  req.token = payload;

  next();
};
