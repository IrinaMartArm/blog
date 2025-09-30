import { Request, Response } from 'express';
import { usersQueryRepository } from '../../repositories/users.query.repositiry';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { usersMapper } from '../../mappers/usersMapper';
import { HttpStatus } from '../../../core';
import { createQuery } from '../../../utils/createDefaultQuery';

const defaultQuery = createDefaultQuery({
  searchLoginTerm: null,
  searchEmailTerm: null,
});

export const getAllUsersHandler = async (req: Request, res: Response) => {
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
};
