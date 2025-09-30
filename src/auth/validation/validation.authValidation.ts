import { body } from 'express-validator';

const loginOrEmailValidation = body('loginOrEmail')
  .isString()
  .trim()
  .isLength({ min: 1, max: 50 });

const passwordValidation = body('password')
  .isString()
  .trim()
  .isLength({ min: 1, max: 50 });

export const loginValidation = [passwordValidation, loginOrEmailValidation];
