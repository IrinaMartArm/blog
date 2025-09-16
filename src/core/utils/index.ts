import { ValidationErrorType } from '../types';

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorsMessages: ValidationErrorType[] } => {
  return { errorsMessages: errors };
};
