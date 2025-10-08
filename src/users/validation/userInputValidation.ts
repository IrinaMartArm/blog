import { body } from 'express-validator';

export const emailValidation = body('email')
  .isString()
  .withMessage('email should be string')
  .trim()
  .isEmail()
  // .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .normalizeEmail();

export const passwordValidation = body('password')
  .isString()
  .withMessage('password should be string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password is not correct');

export const newPasswordValidation = body('newPassword')
  .isString()
  .withMessage('password should be string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password is not correct');

export const loginValidation = body('login')
  .isString()
  .withMessage('Login should be string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .matches(/^[a-zA-Z0-9_-]*$/);

export const userValidation = [
  emailValidation,
  passwordValidation,
  loginValidation,
];
