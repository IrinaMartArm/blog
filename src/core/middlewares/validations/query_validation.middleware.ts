import { BaseQueryInput, SortDirection } from '../../types';
import { query } from 'express-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORTED_BY = 'createdAt';
const DEFAULT_SORT_DIRECTION = SortDirection.Desc;

// export const createDefaultQuery = <S extends string, F extends string>(
//   sortBy: S,
//   extraFields: Record<F, string | null> = {} as Record<F, string | null>,
// ): PaginationAndSorting<S> & Record<F, string | null> => {
//   return {
//     pageNumber: DEFAULT_PAGE,
//     pageSize: DEFAULT_PAGE_SIZE,
//     sortDirection: DEFAULT_SORT_DIRECTION,
//     sortBy,
//     ...extraFields,
//   };
// };

export const createDefaultQuery = <F extends string = never>(
  extraFields?: Record<F, string | null>,
): BaseQueryInput & Record<F, string | null> => {
  return {
    pageNumber: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
    sortDirection: DEFAULT_SORT_DIRECTION,
    sortBy: DEFAULT_SORTED_BY,
    ...(extraFields ?? ({} as Record<F, string | null>)),
  };
};

export const queryValidationMiddleware = <T extends string>(
  sortFieldsEnum: Record<string, T>,
  fields: string[],
) => {
  const allowedSortFields = Object.values(sortFieldsEnum);

  const optionalFields = fields.map((field) =>
    query(field).optional().isString().trim().default(null),
  );

  return [
    ...optionalFields,

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
