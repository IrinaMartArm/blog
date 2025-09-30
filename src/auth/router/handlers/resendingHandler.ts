import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { createErrorMessages, HttpStatus } from '../../../core';

export const resendingHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await authService.resending(req.body);

  if (!result) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages([{ message: '', field: 'email' }]));
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
