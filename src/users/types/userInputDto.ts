import { BaseQueryInput } from '../../core';

export type UserRequestDto = {
  login: string;
  password: string;
  email: string;
};

export enum UsersSortFields {
  Email = 'email',
  Login = 'login',
  CreatedAt = 'createdAt',
}

export type UsersQueryInput = BaseQueryInput & {
  searchLoginTerm?: string | null;
  searchEmailTerm?: string | null;
};
