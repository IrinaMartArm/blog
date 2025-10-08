import { Router } from 'express';
import 'reflect-metadata';
import { validationResultMiddleware } from '../../core';
import { loginValidation } from '../validation/validation.authValidation';
import { authMiddleware } from '../../core/middlewares/validations/auth.middleware';
import {
  emailValidation,
  newPasswordValidation,
  userValidation,
} from '../../users/validation/userInputValidation';
import { checkRefreshTokenMiddleware } from '../../core/middlewares/checkRefreshToken.middleware';
import { requestsRateMiddleware } from '../middlewares/requestsRate.middleware';
import { container } from '../compositionRoot';
import { AuthController } from './authController';

const authController = container.resolve(AuthController);

export const authRouter = Router({});

authRouter.post(
  '/login',
  requestsRateMiddleware(5),
  loginValidation,
  validationResultMiddleware,
  authController.loginHandler.bind(authController),
);

authRouter.get(
  '/me',
  authMiddleware,
  authController.meHandler.bind(authController),
);

authRouter.post(
  '/registration',
  requestsRateMiddleware(5),
  userValidation,
  validationResultMiddleware,
  authController.registrationHandler.bind(authController),
);

authRouter.post(
  '/registration-confirmation',
  requestsRateMiddleware(5),
  authController.confirmationHandler.bind(authController),
);

authRouter.post(
  '/registration-email-resending',
  requestsRateMiddleware(5),
  emailValidation,
  validationResultMiddleware,
  authController.resendingHandler.bind(authController),
);

authRouter.post(
  '/refresh-token',
  checkRefreshTokenMiddleware,
  authController.refreshHandler.bind(authController),
);

authRouter.post(
  '/logout',
  checkRefreshTokenMiddleware,
  authController.logoutHandler.bind(authController),
);

authRouter.post(
  '/password-recovery',
  requestsRateMiddleware(5),
  emailValidation,
  validationResultMiddleware,
  authController.passwordRecoveryHandler.bind(authController),
);

authRouter.post(
  '/new-password',
  requestsRateMiddleware(5),
  newPasswordValidation,
  validationResultMiddleware,
  authController.newPasswordHandler.bind(authController),
);
