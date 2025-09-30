import { Request, Response } from 'express';
import { LoginRequestDto } from '../../types/inputDto';
import { HttpStatus } from '../../../core';
import { authService } from '../../service/authService';

export const loginHandler = async (
  req: Request<{}, {}, LoginRequestDto>,
  res: Response,
) => {
  const accessToken = await authService.login(
    req.body.loginOrEmail,
    req.body.password,
  );
  if (!accessToken) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  return res.status(HttpStatus.Ok).json({ accessToken });
};
