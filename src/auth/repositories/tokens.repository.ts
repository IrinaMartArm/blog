import { RefreshTokenModel } from '../entity/token';
import { injectable } from 'inversify';
import { RefreshTokenDocument } from '../types/authDbModel';

@injectable()
export class TokensRepository {
  async saveToken(token: RefreshTokenDocument) {
    await token.save();
    return;
  }

  async getTokenDoc(userId: string, deviceId: string, jti: string) {
    return RefreshTokenModel.findOne({
      userId,
      deviceId,
      jti,
    });
  }

  async getTokensByUserId(userId: string) {
    return RefreshTokenModel.find({ userId });
  }

  async findTokenByDeviceId(deviceId: string) {
    return RefreshTokenModel.findOne({ deviceId });
  }

  async deleteToken(userId: string, deviceId: string, jti: string) {
    const result = await RefreshTokenModel.deleteOne({ userId, deviceId, jti });
    return result.deletedCount > 0;
  }

  async deleteAllOtherSessions(userId: string, currentDeviceId: string) {
    const res = await RefreshTokenModel.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
    return res.deletedCount > 0;
  }

  // async updateRToken(
  //   userId: string,
  //   deviceId: string,
  //   oldJti: string,
  //   newJti: string,
  //   newExpiresAt: Date,
  // ) {
  //   const result = await RefreshTokenModel.updateOne(
  //     { userId, deviceId, jti: oldJti },
  //     {
  //       $set: {
  //         jti: newJti,
  //         expiresAt: newExpiresAt,
  //         issuedAt: new Date(),
  //       },
  //     },
  //   );
  //   return result.matchedCount > 0;
  // }
}
