import { body } from 'express-validator';

const nameValidation = body('title')
  .isString()
  .withMessage('title should be string')
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Length of title is not correct');

const shortDescriptionValidation = body('shortDescription')
  .isString()
  .withMessage('shortDescriptio should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of shortDescriptio is not correct');

const contentValidation = body('content')
  .isString()
  .withMessage('content should be string')
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Length of content is not correct');

const blogIdValidation = body('blogId')
  .isString()
  .withMessage('blogId should be string')
  .trim()
  .isLength({ min: 1 });

export const newPostValidation = [
  nameValidation,
  shortDescriptionValidation,
  contentValidation,
  blogIdValidation,
];
