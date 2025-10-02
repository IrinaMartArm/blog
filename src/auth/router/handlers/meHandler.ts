import { Request, Response } from 'express';
import {
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../../core/resultCode/result-code';

export const meHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return handleResult(res, handleUnauthorizedResult());
  }

  handleResult(
    res,
    handleSuccessResult({
      email: req.user.email,
      login: req.user.login,
      userId: req.user.id,
    }),
  );
};
