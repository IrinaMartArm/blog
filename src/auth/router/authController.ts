import { AuthService } from '../service/authService';
import { Request, Response } from 'express';
import {
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
  ResultCode,
} from '../../core/resultCode/result-code';
import { injectable } from 'inversify';
import { LoginRequestDto } from '../types/inputDto';
import { sendTokens } from '../utils/sendTokens';

@injectable()
export class AuthController {
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
