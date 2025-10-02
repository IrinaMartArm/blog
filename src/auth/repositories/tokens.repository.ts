import { tokenCollection } from '../../db/mongo.db';
import { RefreshToken } from '../types/authDbModel';

export const tokensRepository = {
  saveToken: async (tokenData: RefreshToken) => {
    await tokenCollection.insertOne(tokenData);
  },
  findToken: async (userId: string, deviceId: string, jti: string) => {
    return await tokenCollection.findOne({ userId, deviceId, jti });
  },
  deleteToken: async (userId: string, deviceId: string, jti: string) => {
    await tokenCollection.deleteOne({ userId, deviceId, jti });
  },
};
