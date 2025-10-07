import { Response, Request } from 'express';
import {
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../../core/resultCode/result-code';
import { tokensQueryRepository } from '../../../auth/repositories/tokensQuery.repository';

export const getDevicesHandler = async (req: Request, res: Response) => {
  const userId = req.token?.userId;

  if (!userId) {
    console.log('no userId found');
    return handleResult(res, handleUnauthorizedResult());
  }

  const devices = await tokensQueryRepository.findSessions(userId);

  handleResult(res, handleSuccessResult(devices));
};
