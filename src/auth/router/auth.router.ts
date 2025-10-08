import { Request, Response, Router } from 'express';
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
import { LoginRequestDto } from '../types/inputDto';
import { AuthService } from '../service/authService';
import {
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
  ResultCode,
} from '../../core/resultCode/result-code';
import { sendTokens } from '../utils/sendTokens';
import { UsersRepository } from '../../users/repositories/users.repositiry';
import { TokensQueryRepository } from '../repositories/tokensQuery.repository';

class AuthController {
  constructor(private authService: AuthService) {}

  async loginHandler(req: Request<{}, {}, LoginRequestDto>, res: Response) {
    const result = await this.authService.login(
      req.body.loginOrEmail,
      req.body.password,
      req.headers['user-agent']?.toString() || 'Unknown device',
      req.ip ||
        req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown',
    );

    if (result.resultCode !== ResultCode.Success) {
      return handleResult(res, result);
    }

    return sendTokens(res, result.data);
  }

  async meHandler(req: Request, res: Response) {
    if (!req.user) {
      return handleResult(res, handleUnauthorizedResult());
    }

    handleResult(
      res,
      handleSuccessResult({
        email: req.user.email,
        login: req.user.login,
        userId: req.user.id,
      }),
    );
  }

  async registrationHandler(req: Request, res: Response) {
    const result = await this.authService.registration(req.body);

    handleResult(res, result);
  }

  async confirmationHandler(req: Request, res: Response) {
    const result = await this.authService.confirmation(req.body);

    return handleResult(res, result);
  }

  async resendingHandler(req: Request, res: Response) {
    const result = await this.authService.resending(req.body);

    return handleResult(res, result);
  }

  async refreshHandler(req: Request, res: Response) {
    const token = req.token;

    if (!token) {
      handleResult(res, handleUnauthorizedResult());
      return;
    }

    const result = await this.authService.refreshToken(token);

    if (!result || !result.data) {
      handleResult(res, handleUnauthorizedResult());
      return;
    }

    sendTokens(res, result.data);
  }

  async logoutHandler(req: Request, res: Response) {
    const token = req.token!;

    const result = await this.authService.logout(token);

    res.clearCookie('refreshToken');

    return handleResult(res, result);
  }

  async newPasswordHandler(req: Request, res: Response) {
    const result = await this.authService.newPassword(req.body);

    return handleResult(res, result);
  }

  async passwordRecoveryHandler(req: Request, res: Response) {
    const result = await this.authService.passwordRecovery(req.body);

    return handleResult(res, result);
  }
}

const usersRepository = new UsersRepository();
const tokensQueryRepository = new TokensQueryRepository();

const authService = new AuthService(usersRepository, tokensQueryRepository);

const authController = new AuthController(authService);

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
