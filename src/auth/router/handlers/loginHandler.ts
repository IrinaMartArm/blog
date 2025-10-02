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
  );

  const response = handleResult(res, result);
  if (result.resultCode !== ResultCode.Success) return response;

  sendTokens(res, result.data);
};
