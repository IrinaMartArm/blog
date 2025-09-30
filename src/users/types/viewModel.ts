export type UserViewDto = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UsersViewModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserViewDto[];
};

export type UserViewModel = Omit<UserViewDto, 'createdAt'>;
