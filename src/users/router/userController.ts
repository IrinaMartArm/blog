import { injectable } from 'inversify';
import { UsersService } from '../services/usersService';
import { Request, Response } from 'express';
import { usersQueryRepository } from '../repositories/users.query.repository';
import { createErrorMessages, HttpStatus } from '../../core';
import { userMapper } from '../mappers/userMapper';
import { createDefaultQuery } from '../../core/middlewares/validations/query_validation.middleware';
import { createQuery } from '../../utils/createDefaultQuery';
import { usersMapper } from '../mappers/usersMapper';

@injectable()
export class UsersController {
  constructor(private usersService: UsersService) {}

  async createUserHandler(req: Request, res: Response) {
    try {
      const newUserId = await this.usersService.createUser(req.body);
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
  }

  async deleteUserHandler(req: Request, res: Response) {
    const user = await usersQueryRepository.getUserById(req.params.id);
    if (!user) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'User not found' }]),
        );
      return;
    }
    await this.usersService.deleteUser(req.params.id);
    res.sendStatus(HttpStatus.NoContent);
  }

  async getAllUsersHandler(req: Request, res: Response) {
    const defaultQuery = createDefaultQuery({
      searchLoginTerm: null,
      searchEmailTerm: null,
    });

    const searchQuery = createQuery(req.query, defaultQuery);
    const { items, totalCount } =
      await usersQueryRepository.getAllUsers(searchQuery);

    const usersViewModel = usersMapper(
      items,
      searchQuery.pageNumber,
      searchQuery.pageSize,
      totalCount,
    );

    return res.status(HttpStatus.Ok).send(usersViewModel);
  }
}
