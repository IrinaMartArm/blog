import { usersService } from '../../services/usersService';
import { Request, Response } from 'express';
import { usersQueryRepository } from '../../repositories/users.query.repositiry';
import { createErrorMessages, HttpStatus } from '../../../core';

export const deleteUserHandler = async (req: Request, res: Response) => {
  const user = await usersQueryRepository.getUserById(req.params.id);
  if (!user) {
    res
      .status(HttpStatus.NotFound)
      .send(createErrorMessages([{ field: 'id', message: 'User not found' }]));
    return;
  }
  await usersService.deleteUser(req.params.id);
  res.sendStatus(HttpStatus.NoContent);
};
