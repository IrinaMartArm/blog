import {
  RefreshTokenDb,
  RefreshTokenDocument,
  RefreshTokenStatics,
} from '../types/authDbModel';
import mongoose, { Model, Schema } from 'mongoose';

export const REFRESH_TOKEN = 'refreshToken';

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: { type: String, required: true, index: true },
    deviceId: { type: String, required: true },
    title: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    jti: { type: String, required: true },
    ip: { type: String, required: true },
  },
  { versionKey: false },
);

refreshTokenSchema.index({ userId: 1, deviceId: 1, jti: 1 }, { unique: true });

refreshTokenSchema.statics.saveToken = async function (
  tokenData: RefreshTokenDb,
) {
  const token = new RefreshTokenModel(tokenData);
  await token.save();
};

export const RefreshTokenModel = mongoose.model<
  RefreshTokenDocument,
  Model<RefreshTokenDocument> & RefreshTokenStatics
>(REFRESH_TOKEN, refreshTokenSchema);
