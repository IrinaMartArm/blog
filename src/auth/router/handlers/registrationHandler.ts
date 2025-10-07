import { Response, Request } from 'express';
import { authService } from '../../service/authService';
import { handleResult } from '../../../core/resultCode/result-code';

export const registrationHandler = async (req: Request, res: Response) => {
  const result = await authService.registration(req.body);

  handleResult(res, result);
};
