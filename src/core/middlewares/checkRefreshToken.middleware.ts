import { NextFunction, Request, Response } from 'express';
import { jwtService } from '../../auth/service/jwtService';
import { RefreshTokenDb } from '../../auth/types/authDbModel';
import {
  handleResult,
  handleUnauthorizedResult,
} from '../resultCode/result-code';

export const checkRefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return handleResult(res, handleUnauthorizedResult());
  }

  const payload = jwtService.verifyToken<RefreshTokenDb>(token);

  if (!payload) {
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    return handleResult(res, handleUnauthorizedResult());
  }

  req.token = payload;

  next();
};
