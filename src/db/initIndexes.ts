import { requestsCollection, tokenCollection } from './mongo.db';

export const initIndexes = async () => {
  try {
    await requestsCollection.createIndex(
      { date: 1 },
      { expireAfterSeconds: 20 },
    );

    await tokenCollection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
  } catch (e) {
    console.error('Index creation error:', e);
  }
};
