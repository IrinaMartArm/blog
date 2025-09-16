import { body } from 'express-validator';

const blogNameValidation = body('name')
  .isString()
  .withMessage('Name should be string')
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Length of name is not correct');

const blogDescriptionValidation = body('description')
  .isString()
  .withMessage('Description should be string')
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Length of description is not correct');

const blogWebsiteUrlValidation = body('websiteUrl')
  .isString()
  .withMessage('WebsiteUrl should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of description is not correct')
  .matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  );

export const blogInputValidation = [
  blogNameValidation,
  blogDescriptionValidation,
  blogWebsiteUrlValidation,
];
