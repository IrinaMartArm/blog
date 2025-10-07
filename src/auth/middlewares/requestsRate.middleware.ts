import { NextFunction, Response, Request } from 'express';
import { requestsRepository } from '../repositories/requests.repository';

export const requestsRateMiddleware = (limit: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress;
    const url = req.originalUrl || req.baseUrl;

    if (!ip) return res.sendStatus(400);

    await requestsRepository.addRequest(ip, url);

    const tenSecondsAgo = new Date(Date.now() - 10 * 1000);
    const requestsCount = await requestsRepository.countRequests(
      ip,
      url,
      tenSecondsAgo,
    );

    if (requestsCount > limit) {
      res.status(429).json({
        errorsMessages: [
          {
            message: 'Too many requests, try again later',
            field: url,
          },
        ],
      });
      return;
    }

    next();
  };
};
