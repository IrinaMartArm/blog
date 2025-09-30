import { Request, Response } from 'express';
import { createErrorMessages, HttpStatus } from '../../../core';

export const meHandler = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(HttpStatus.Unauthorized)
      .send(createErrorMessages([{ message: '', field: '' }]));
  }

  res.status(HttpStatus.Ok).json({
    email: req.user.email,
    login: req.user.login,
    userId: req.user.id,
  });
};
