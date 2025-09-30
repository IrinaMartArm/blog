import { createErrorMessages, HttpStatus } from '../../../core';
import { Response, Request } from 'express';
import { authService } from '../../service/authService';

export const registrationHandler = async (req: Request, res: Response) => {
  const result = await authService.registration(req.body);

  if (result === 'emailExists') {
    return res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { message: 'Email already exists', field: 'email' },
        ]),
      );
  }

  if (result === 'loginExists') {
    return res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { message: 'Login already exists', field: 'login' },
        ]),
      );
  }

  if (!result) {
    return res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { message: 'Something went wrong', field: 'email' },
        ]),
      );
  }
  res.sendStatus(HttpStatus.NoContent);
};
