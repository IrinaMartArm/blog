import { tokenCollection } from '../../db/mongo.db';
import { RefreshTokenDbModel } from '../types/authDbModel';

export const tokensRepository = {
  saveToken: async (tokenData: RefreshTokenDbModel) => {
    const token = await tokenCollection.insertOne(tokenData);
    return !!token.insertedId;
  },

  async updateRToken(
    userId: string,
    deviceId: string,
    oldJti: string,
    newJti: string,
    newExpiresAt: Date,
  ) {
    const result = await tokenCollection.updateOne(
      { userId, deviceId, jti: oldJti },
      {
        $set: {
          jti: newJti,
          expiresAt: newExpiresAt,
          issuedAt: new Date(),
        },
      },
    );
    return result.matchedCount > 0;
  },

  updateToken: async (
    userId: string,
    deviceId: string,
    updateData: Partial<RefreshTokenDbModel>,
  ) => {
    await tokenCollection.updateOne({ userId, deviceId }, { $set: updateData });
  },

  deleteToken: async (userId: string, deviceId: string, jti: string) => {
    const result = await tokenCollection.deleteOne({ userId, deviceId, jti });
    return result.deletedCount > 0;
  },

  async deleteAllOtherSessions(userId: string, currentDeviceId: string) {
    const res = await tokenCollection.deleteMany({
      userId,
      deviceId: { $ne: currentDeviceId },
    });
    return res.deletedCount > 0;
  },

  async deleteSession(userId: string, deviceId: string) {
    const result = await tokenCollection.deleteOne({ userId, deviceId });
    return result.deletedCount > 0;
  },
};
