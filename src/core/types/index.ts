export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,

  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,

  InternalServerError = 500,
}

export type ValidationErrorType = {
  field: string;
  message: string;
};

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type PaginationAndSorting<S> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};

export type BlogsQueryInput = PaginationAndSorting<string> & {
  searchNameTerm?: string | null;
};

export enum BlogsSortFields {
  CreatedAt = 'createdAt',
  Name = 'name',
  Description = 'description',
  IsMembership = 'isMembership',
  WebsiteUrl = 'websiteUrl',
}

export enum PostsSortFields {
  CreatedAt = 'createdAt',
  Title = 'title',
  ShortDescription = 'shortDescription',
  Content = 'content',
  BlogName = 'blogName',
}
