export type RefreshTokenDbModel = {
  userId: string;
  expiresAt: Date;
  deviceId: string;
  jti: string;
};

export type RefreshToken = {
  userId: string;
  expiresAt: Date;
  deviceId: string;
  jti: string;
};
