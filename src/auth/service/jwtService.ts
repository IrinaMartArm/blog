import jwt from 'jsonwebtoken';

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

  getUserIdByAccessToken(token: string | undefined): string | undefined {
    if (!token) return undefined;

    // Обычно передаётся "Bearer <token>"
    const accessToken = token.startsWith('Bearer ')
      ? token.split(' ')[1]
      : token;

    const payload = this.verifyToken<{ userId: string }>(accessToken);
    return payload?.userId;
  },
};
