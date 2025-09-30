import { UserDbModel } from '../types/modelDb';
import { UserViewDto } from '../types/viewModel';

export const userMapper = (user: UserDbModel): UserViewDto => ({
  id: user._id.toString(),
  login: user.login,
  email: user.email,
  createdAt: user.createdAt,
});
