import { Request, Response, Router } from 'express';
import { IdValidation, validationResultMiddleware } from '../../core';
import { checkRefreshTokenMiddleware } from '../../core/middlewares/checkRefreshToken.middleware';
import {
  handleNoContentResult,
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../core/resultCode/result-code';
import { TokensQueryRepository } from '../../auth/repositories/tokensQuery.repository';
import { AuthService } from '../../auth/service/authService';
import { UsersRepository } from '../../users/repositories/users.repository';

export const securityRouter = Router({});

class SessionsController {
  constructor(
    private tokensQueryRepository: TokensQueryRepository,
    private authService: AuthService,
  ) {}

  async getDevicesHandler(req: Request, res: Response) {
    const userId = req.token?.userId;

    if (!userId) {
      console.log('no userId found');
      return handleResult(res, handleUnauthorizedResult());
    }

    const devices = await this.tokensQueryRepository.findSessions(userId);

    handleResult(res, handleSuccessResult(devices));
  }

  async deleteDevicesHandler(req: Request, res: Response) {
    const deviceId = req.token?.deviceId;
    const userId = req.token?.userId;

    if (!userId || !userId || !deviceId) {
      return handleResult(res, handleUnauthorizedResult());
    }

    const result = await this.authService.deleteOtherDevices(userId, deviceId);
    return handleResult(res, handleNoContentResult(result));
  }

  async deleteDeviceByIdHandler(req: Request, res: Response) {
    const deviceId = req.params.id;
    const userId = req.token?.userId;

    if (!userId) {
      return handleResult(res, handleUnauthorizedResult());
    }

    const deleted = await this.authService.deleteDeviceById(userId, deviceId);
    handleResult(res, deleted);
  }
}

const usersRepository = new UsersRepository();
const tokensQueryRepository = new TokensQueryRepository();
const authService = new AuthService(usersRepository, tokensQueryRepository);

const sessionsController = new SessionsController(
  tokensQueryRepository,
  authService,
);

securityRouter.get(
  '/devices',
  checkRefreshTokenMiddleware,
  sessionsController.getDevicesHandler.bind(sessionsController),
);

securityRouter.delete(
  '/devices',
  checkRefreshTokenMiddleware,
  sessionsController.deleteDevicesHandler.bind(sessionsController),
);

securityRouter.delete(
  '/devices/:id',
  checkRefreshTokenMiddleware,
  IdValidation,
  validationResultMiddleware,
  sessionsController.deleteDeviceByIdHandler.bind(sessionsController),
);
