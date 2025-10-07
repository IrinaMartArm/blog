import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { sendTokens } from '../../utils/sendTokens';
import {
  handleResult,
  handleUnauthorizedResult,
} from '../../../core/resultCode/result-code';

export const refreshHandler = async (req: Request, res: Response) => {
  const token = req.token;

  if (!token) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  const result = await authService.refreshToken(token);

  if (!result || !result.data) {
    handleResult(res, handleUnauthorizedResult());
    return;
  }

  sendTokens(res, result.data);
};
