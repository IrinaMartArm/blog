import { requestsCollection } from './mongo.db';

export const initIndexes = async () => {
  try {
    await requestsCollection.createIndex(
      { date: 1 },
      { expireAfterSeconds: 20 },
    );
  } catch (e) {
    console.error('Index creation error:', e);
  }
};
