import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const jwtService = {
  createToken(userId: string, expiresIn?: jwt.SignOptions['expiresIn']) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: expiresIn ?? '10s' });
  },

  createRefreshToken(
    userId: string,
    deviceId: string,
    jti: string,
    expiresIn?: jwt.SignOptions['expiresIn'],
  ) {
    const token = jwt.sign({ userId, deviceId, jti }, JWT_SECRET, {
      expiresIn: expiresIn ?? `20s`,
    });
    return { token, deviceId };
  },

  verifyToken<T = any>(token: string): T | null {
    try {
      return jwt.verify(token, JWT_SECRET) as T;
    } catch {
      return null;
    }
  },
};
