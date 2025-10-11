import { body } from 'express-validator';
import { LikeStatusValue } from '../models';

export const commentValidation = body('content')
  .isString()
  .trim()
  .isLength({ min: 20, max: 300 });

export const likeStatusValidation = body('likeStatus')
  .isString()
  .isIn(Object.values(LikeStatusValue))
  .withMessage(
    `Like status must be one of: ${Object.values(LikeStatusValue).join(', ')}`,
  );
