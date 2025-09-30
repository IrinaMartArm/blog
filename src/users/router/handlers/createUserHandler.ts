import { Request, Response } from 'express';
import { usersService } from '../../services/usersService';
import { usersQueryRepository } from '../../repositories/users.query.repositiry';
import { userMapper } from '../../mappers/userMapper';
import { HttpStatus } from '../../../core';

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const newUserId = await usersService.createUser(req.body);
    const user = await usersQueryRepository.getUserById(newUserId);
    if (!user) {
      return res.sendStatus(HttpStatus.NotFound);
    }
    const mappedUser = userMapper(user);
    res.status(HttpStatus.Created).send(mappedUser);
  } catch (err: any) {
    if (err.message === 'Login already exists') {
      return res.status(HttpStatus.BadRequest).send({
        errorsMessages: [{ field: 'login', message: 'Login already exists' }],
      });
    }

    if (err.message === 'Email already exists') {
      return res.status(HttpStatus.BadRequest).send({
        errorsMessages: [{ field: 'email', message: 'Email already exists' }],
      });
    }

    // Общая ошибка для остальных случаев
    return res.status(HttpStatus.BadRequest).send({
      errorsMessages: [{ field: '', message: 'Bad Request' }],
    });
  }
};
