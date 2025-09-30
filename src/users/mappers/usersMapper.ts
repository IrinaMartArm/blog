import { UserDbModel } from '../types/modelDb';
import { UsersViewModel } from '../types/viewModel';

export const usersMapper = (
  users: UserDbModel[],
  page: number,
  pageSize: number,
  totalCount: number,
): UsersViewModel => ({
  pagesCount: Math.ceil(totalCount / pageSize),
  page,
  pageSize,
  totalCount,
  items: users.map((user) => ({
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  })),
});
