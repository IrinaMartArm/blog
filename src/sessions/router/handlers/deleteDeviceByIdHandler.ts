import { Response, Request } from 'express';
import { authService } from '../../../auth/service/authService';
import {
  handleResult,
  handleUnauthorizedResult,
} from '../../../core/resultCode/result-code';

export const deleteDeviceByIdHandler = async (req: Request, res: Response) => {
  const deviceId = req.params.id;
  const userId = req.token?.userId;

  if (!userId) {
    return handleResult(res, handleUnauthorizedResult());
  }

  const deleted = await authService.deleteDeviceById(userId, deviceId);
  handleResult(res, deleted);
};
