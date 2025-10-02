import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { HttpStatus } from '../../../core';

export const logoutHandler = async (req: Request, res: Response) => {
  const token = req.token!;
  const result = await authService.logout(token);

  if (!result) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }
  res.clearCookie('refreshToken');
  res.sendStatus(HttpStatus.NoContent);
};
