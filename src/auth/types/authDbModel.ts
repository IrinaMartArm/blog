export type RequestLogDbModel = { IP: string; URL: string; date: Date };

export type RefreshTokenDbModel = {
  userId: string;
  deviceId: string;
  title: string;
  issuedAt: Date;
  expiresAt: Date;
  jti: string;
  ip: string;
};
