import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { handleResult } from '../../../core/resultCode/result-code';

export const logoutHandler = async (req: Request, res: Response) => {
  const token = req.token!;

  const result = await authService.logout(token);

  res.clearCookie('refreshToken');

  return handleResult(res, result);
};
