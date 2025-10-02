import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { REFRESH_TOKEN_LIFE } from '../../core';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const jwtService = {
  createToken(userId: string, expiresIn?: number) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiresIn ?? 3600 });
  },

  createRefreshToken(userId: string, expiresIn?: number) {
    const jti = randomUUID();
    const deviceId = randomUUID();
    const token = jwt.sign({ userId, jti, deviceId }, JWT_SECRET, {
      expiresIn: expiresIn ?? REFRESH_TOKEN_LIFE,
    });
    return { token, jti, deviceId };
  },

  verifyToken<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, JWT_SECRET) as T;
    } catch {
      return null;
    }
  },
};
