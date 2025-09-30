export enum HttpStatus {
  Ok = 200,
  Created = 201,
  NoContent = 204,

  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
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

export interface BaseQueryInput {
  sortBy: string;
  sortDirection: SortDirection;
  pageSize: number;
  pageNumber: number;
}

export type BlogsQueryInput = BaseQueryInput & {
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
