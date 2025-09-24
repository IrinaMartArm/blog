import { BlogsQueryInput, SortDirection } from '../../types';
import { query } from 'express-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SEARCH_TERM = null;
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

export const defaultQuery: BlogsQueryInput = {
  pageNumber: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  sortDirection: DEFAULT_SORT_DIRECTION,
  sortBy: 'createdAt',
  searchNameTerm: DEFAULT_SEARCH_TERM,
};

export const queryValidationMiddleware = <T extends string>(
  sortFieldsEnum: Record<string, T>,
) => {
  const allowedSortFields = Object.values(sortFieldsEnum);
  return [
    query('searchNameTerm').optional().isString().trim().default(null),

    query('pageNumber')
      .optional()
      .default(DEFAULT_PAGE)
      .isInt({ min: 1 })
      .withMessage('Page number must be a positive integer')
      .toInt(),

    query('pageSize')
      .optional()
      .default(DEFAULT_PAGE_SIZE)
      .isInt({ min: 1 })
      .withMessage('pageSize must be a positive integer')
      .toInt(),

    query('sortDirection')
      .optional()
      .default(DEFAULT_SORT_DIRECTION)
      .isIn(Object.values(SortDirection))
      .withMessage(
        `SortDirection must be one of: ${Object.values(SortDirection).join(', ')} `,
      ),

    query('sortBy')
      .optional()
      .default(allowedSortFields[0])
      .isIn(allowedSortFields)
      .withMessage(`Sort must be one of: ${allowedSortFields.join(', ')}`),
  ];
};
