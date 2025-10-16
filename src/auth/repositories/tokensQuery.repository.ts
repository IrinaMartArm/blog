import { SessionsViewModel } from '../../sessions/types/sessionsViewModel';
import { injectable } from 'inversify';
import { RefreshTokenModel } from '../entity/token';

@injectable()
export class TokensQueryRepository {
  async findSessions(userId: string): Promise<SessionsViewModel[]> {
    const devices = await RefreshTokenModel.find({ userId }).lean();
    return devices.map((s) => ({
      deviceId: s.deviceId,
      title: s.title,
      lastActiveDate: s.issuedAt.toISOString(),
      ip: s.ip,
    }));
  }
}
