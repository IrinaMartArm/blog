import { BaseQueryInput } from '../core';

export function createQuery<T extends BaseQueryInput>(
  query: Partial<T>,
  defaultQuery: Required<T>,
): T {
  return {
    ...defaultQuery,
    ...query,
    // sortBy: query.sortBy ?? defaultQuery.sortBy,
    // sortDirection: query.sortDirection ?? defaultQuery.sortDirection,
    pageSize: query.pageSize ? +query.pageSize : defaultQuery.pageSize,
    pageNumber: query.pageNumber ? +query.pageNumber : defaultQuery.pageNumber,
  };
}
