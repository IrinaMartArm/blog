import 'reflect-metadata';
import { Container } from 'inversify';
import { AuthService } from './service/authService';
import { TokensQueryRepository } from './repositories/tokensQuery.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { UsersService } from '../users/services/usersService';
import { UsersController } from '../users/router/userController';
import { AuthController } from './router/authController';

export const container = new Container({});

container.bind(UsersRepository).toSelf();
container.bind(TokensQueryRepository).toSelf();
container.bind(UsersService).toSelf();
container.bind<AuthService>(AuthService).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<UsersController>(UsersController).toSelf();
