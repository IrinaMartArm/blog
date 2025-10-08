import { tokenCollection } from '../../db/mongo.db';
import { SessionsViewModel } from '../../sessions/types/sessionsViewModel';
import { injectable } from 'inversify';

@injectable()
export class TokensQueryRepository {
  async findTokenByDeviceId(deviceId: string) {
    const token = await tokenCollection.findOne({ deviceId });
    if (!token) return null;
    return {
      deviceId: token.deviceId,
      title: token.title,
      lastActiveDate: token.issuedAt.toISOString(),
      ip: token.ip,
      userId: token.userId.toString(),
      expiresAt: token.expiresAt.toISOString(),
      jti: token.jti,
    };
  }

  async findSessions(userId: string): Promise<SessionsViewModel[]> {
    const devices = await tokenCollection.find({ userId }).toArray();
    return devices.map((s) => ({
      deviceId: s.deviceId,
      title: s.title,
      lastActiveDate: s.issuedAt.toISOString(),
      ip: s.ip,
    }));
  }
}
