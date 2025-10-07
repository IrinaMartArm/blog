import { Request, Response, NextFunction } from 'express';
import {
  FieldValidationError,
  ValidationError,
  validationResult,
} from 'express-validator';
import { HttpStatus, ValidationErrorType } from '../../types';
import {
  handleBadRequestResult,
  handleResult,
} from '../../resultCode/result-code';

const formatErrors = (error: ValidationError): ValidationErrorType => {
  const expressError = error as unknown as FieldValidationError;

  return {
    message: expressError.msg,
    field: expressError.path,
  };
};

export const validationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    console.log(errors);
    handleResult(res, handleBadRequestResult(errors));
    return;
  }
  next();
};
