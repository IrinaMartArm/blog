import { Response } from 'express';
import { HttpStatus, ValidationErrorType } from '../types';

export enum ResultCode {
  Success = 0,
  Forbidden = 1,
  BadRequest = 2,
  Unauthorized = 3,
  NotFound = 4,
  Created = 5,
  NoContent = 6,
}

export type SuccessResult<T> = {
  resultCode: ResultCode.Success | ResultCode.Created | ResultCode.NoContent;
  data: T;
};

export type ErrorResult = {
  resultCode:
    | ResultCode.BadRequest
    | ResultCode.Unauthorized
    | ResultCode.Forbidden
    | ResultCode.NotFound;
  data: null;
  errors?: ValidationErrorType[];
};

export type Result<T> = SuccessResult<T> | ErrorResult;

export const handleSuccessResult = <T>(data: T): Result<T> => {
  return {
    data,
    resultCode: ResultCode.Success,
  };
};

export const handleCreatedResult = <T>(data: T): Result<T> => {
  return {
    data,
    resultCode: ResultCode.Created,
  };
};

export const handleNoContentResult = <T>(data: T): Result<T> => {
  return {
    data,
    resultCode: ResultCode.NoContent,
  };
};

export const handleUnauthorizedResult = (): ErrorResult => {
  return {
    data: null,
    resultCode: ResultCode.Unauthorized,
  };
};

export const handleForbiddenResult = (): ErrorResult => {
  return {
    data: null,
    resultCode: ResultCode.Forbidden,
  };
};

export const handleNotFoundResult = (): ErrorResult => {
  return {
    data: null,
    resultCode: ResultCode.NotFound,
  };
};

export const handleBadRequestResult = (
  errors: ValidationErrorType[],
): ErrorResult => {
  return {
    data: null,
    resultCode: ResultCode.NotFound,
    errors,
  };
};

export const handleResult = <T>(res: Response, result: Result<T>) => {
  switch (result.resultCode) {
    case ResultCode.Success:
      return res.status(HttpStatus.Ok).json(result.data);
    case ResultCode.Created:
      return res.status(HttpStatus.Created).send(result.data);
    case ResultCode.NoContent:
      return res.sendStatus(HttpStatus.NoContent);
    case ResultCode.Forbidden:
      return res.sendStatus(HttpStatus.Forbidden);
    case ResultCode.NotFound:
      return res.sendStatus(HttpStatus.NotFound);
    case ResultCode.BadRequest:
      return res
        .status(HttpStatus.BadRequest)
        .send({ errorsMessages: result.errors });
    case ResultCode.Unauthorized:
      return res.sendStatus(HttpStatus.Unauthorized);
    default:
      return res.sendStatus(500);
  }
};
