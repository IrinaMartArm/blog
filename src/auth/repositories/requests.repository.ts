import { requestsCollection } from '../../db/mongo.db';
import { injectable } from 'inversify';

@injectable()
export class RequestsRepository {
  async addRequest(ip: string, url: string): Promise<void> {
    await requestsCollection.insertOne({
      IP: ip,
      URL: url,
      date: new Date(),
    });
  }

  async countRequests(ip: string, url: string, since: Date): Promise<number> {
    return requestsCollection.countDocuments({
      IP: ip,
      URL: url,
      date: { $gte: since },
    });
  }
}
