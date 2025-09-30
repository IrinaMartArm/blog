import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const jwtService = {
  createToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  },
  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  },
};
