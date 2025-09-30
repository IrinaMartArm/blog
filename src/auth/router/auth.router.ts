import { Router } from 'express';
import { loginHandler } from './handlers/loginHandler';
import { validationResultMiddleware } from '../../core';
import { loginValidation } from '../validation/validation.authValidation';
import { authMiddleware } from '../../core/middlewares/validations/auth.middleware';
import { meHandler } from './handlers/meHandler';
import {
  emailValidation,
  userValidation,
} from '../../users/validation/userInputValidation';
import { registrationHandler } from './handlers/registrationHandler';
import { confirmationHandler } from './handlers/confirmationHandler';
import { resendingHandler } from './handlers/resendingHandler';
// import {
//   confirmationLimiter,
//   registrationLimiter,
//   resendLimiter,
// } from '../../core/middlewares/requestsLimiter';
// import { refreshHandler } from './handlers/refreshHandler';

export const authRouter = Router({});

authRouter.post(
  '/login',
  loginValidation,
  validationResultMiddleware,
  loginHandler,
);

authRouter.get('/me', authMiddleware, meHandler);

authRouter.post(
  '/registration',
  // registrationLimiter,
  userValidation,
  validationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  '/registration-confirmation',
  // confirmationLimiter,
  confirmationHandler,
);

authRouter.post(
  '/registration-email-resending',
  // resendLimiter,
  emailValidation,
  validationResultMiddleware,
  resendingHandler,
);

// authRouter.post('/refresh-token', refreshHandler);
//
// authRouter.post('/logout');
