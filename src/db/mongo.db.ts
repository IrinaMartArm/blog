import { Collection, Db, MongoClient } from 'mongodb';
import { BlogsData } from '../blogs/types';
import { PostData } from '../posts/types';
import { SETTINGS } from '../core/settings';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogsCollection: Collection<BlogsData>;
export let postsCollection: Collection<PostData>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogsCollection = db.collection<BlogsData>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<PostData>(POSTS_COLLECTION_NAME);

  try {
    await client.connect();
    await db.command({ ping: 1 });
  } catch (err) {
    await client.close();
    throw new Error('Error connecting to MongoDB');
  }
};

export const stopDB = async (): Promise<void> => {
  await client.close();
};
