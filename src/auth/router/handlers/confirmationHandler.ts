import { Request, Response } from 'express';
import { authService } from '../../service/authService';
import { createErrorMessages, HttpStatus } from '../../../core';

export const confirmationHandler = async (req: Request, res: Response) => {
  const result = await authService.confirmation(req.body);
  if (!result) {
    res
      .status(HttpStatus.BadRequest)
      .send(createErrorMessages([{ message: 'bad request', field: 'code' }]));
    return;
  }
  res.sendStatus(HttpStatus.NoContent);
};
