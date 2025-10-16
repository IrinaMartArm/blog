import { HydratedDocument } from 'mongoose';

export type RequestLogDbModel = { IP: string; URL: string; date: Date };

export type RefreshTokenDb = {
  userId: string;
  deviceId: string;
  title: string;
  issuedAt: Date;
  expiresAt: Date;
  jti: string;
  ip: string;
};

export type RefreshTokenDocument = HydratedDocument<RefreshTokenDb>;

export interface RefreshTokenStatics {
  createToken(tokenData: RefreshTokenDb): RefreshTokenDocument;
}
