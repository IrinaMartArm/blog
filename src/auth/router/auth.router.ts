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
import { refreshHandler } from './handlers/refreshHandler';
import { logoutHandler } from './handlers/logoutHandler';
import { checkRefreshTokenMiddleware } from '../../core/middlewares/checkRefreshToken.middleware';
import { requestsRateMiddleware } from '../middlewares/requestsRate.middleware';

export const authRouter = Router({});

authRouter.post(
  '/login',
  requestsRateMiddleware(5),
  loginValidation,
  validationResultMiddleware,
  loginHandler,
);

authRouter.get('/me', authMiddleware, meHandler);

authRouter.post(
  '/registration',
  requestsRateMiddleware(5),
  userValidation,
  validationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  '/registration-confirmation',
  requestsRateMiddleware(5),
  confirmationHandler,
);

authRouter.post(
  '/registration-email-resending',
  requestsRateMiddleware(5),
  emailValidation,
  validationResultMiddleware,
  resendingHandler,
);

authRouter.post('/refresh-token', checkRefreshTokenMiddleware, refreshHandler);

authRouter.post('/logout', checkRefreshTokenMiddleware, logoutHandler);
