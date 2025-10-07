import { Response, Request } from 'express';
import { authService } from '../../../auth/service/authService';
import {
  handleNoContentResult,
  handleResult,
  handleUnauthorizedResult,
} from '../../../core/resultCode/result-code';

export const deleteDevicesHandler = async (req: Request, res: Response) => {
  const deviceId = req.token?.deviceId;
  const userId = req.token?.userId;

  if (!userId || !userId || !deviceId) {
    return handleResult(res, handleUnauthorizedResult());
  }

  const result = await authService.deleteOtherDevices(userId, deviceId);
  return handleResult(res, handleNoContentResult(result));
};
