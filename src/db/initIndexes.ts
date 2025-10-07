import { requestsCollection, tokenCollection } from './mongo.db';

export const initIndexes = async () => {
  await requestsCollection.createIndex({ date: 1 }, { expireAfterSeconds: 30 });
  // await tokenCollection.createIndex(
  //   { expiresAt: 1 },
  //   { expireAfterSeconds: 0 },
  // );
};
