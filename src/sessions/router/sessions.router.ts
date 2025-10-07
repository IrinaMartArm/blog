import { Router } from 'express';
import {
  getDevicesHandler,
  deleteDevicesHandler,
  deleteDeviceByIdHandler,
} from './handlers';
import { deviceIdValidation, validationResultMiddleware } from '../../core';
import { checkRefreshTokenMiddleware } from '../../core/middlewares/checkRefreshToken.middleware';

export const securityRouter = Router({});

securityRouter.get('/devices', checkRefreshTokenMiddleware, getDevicesHandler);

securityRouter.delete(
  '/devices',
  checkRefreshTokenMiddleware,
  deleteDevicesHandler,
);

securityRouter.delete(
  '/devices/:id',
  checkRefreshTokenMiddleware,
  deviceIdValidation,
  validationResultMiddleware,
  deleteDeviceByIdHandler,
);
