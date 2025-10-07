import { Request, Response } from 'express';
import { LoginRequestDto } from '../../types/inputDto';

import { authService } from '../../service/authService';
import { sendTokens } from '../../utils/sendTokens';
import { handleResult, ResultCode } from '../../../core/resultCode/result-code';

export const loginHandler = async (
  req: Request<{}, {}, LoginRequestDto>,
  res: Response,
) => {
  const result = await authService.login(
    req.body.loginOrEmail,
    req.body.password,
    req.headers['user-agent']?.toString() || 'Unknown device',
    req.ip ||
      req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown',
  );

  if (result.resultCode !== ResultCode.Success) {
    return handleResult(res, result);
  }

  return sendTokens(res, result.data);
};
