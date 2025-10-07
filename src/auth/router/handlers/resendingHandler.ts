import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { handleResult } from '../../../core/resultCode/result-code';

export const resendingHandler = async (req: Request, res: Response) => {
  const result = await authService.resending(req.body);

  return handleResult(res, result);
};
