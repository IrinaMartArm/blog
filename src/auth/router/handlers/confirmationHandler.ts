import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { createErrorMessages, HttpStatus } from '../../../core';

export const confirmationHandler = async (req: Request, res: Response) => {
  const result = await authService.confirmation(req.body);
  if (!result) {
    return res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages([{ message: 'bad request', field: 'code' }]));
  }
  res.sendStatus(HttpStatus.NoContent);
};
