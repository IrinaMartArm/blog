import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { sendTokens } from '../../utils/sendTokens';
import { HttpStatus } from '../../../core';

export const refreshHandler = async (req: Request, res: Response) => {
  const token = req.token!;

  const result = await authService.refreshToken(token);
  if (!result) {
    return res.sendStatus(HttpStatus.Unauthorized);
  }

  const { accessToken, refreshToken } = result;
  sendTokens(res, { refreshToken, accessToken });
};
