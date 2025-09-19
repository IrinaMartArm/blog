import { Collection, Db, MongoClient } from 'mongodb';
import { BlogResponseDto } from '../blogs/types';
import { PostResponseDto } from '../posts/types';
import { SETTINGS } from '../core/settings';

const BLOGS_COLLECTION_NAME = 'blogs';
const POSTS_COLLECTION_NAME = 'posts';

export let client: MongoClient;
export let blogsCollection: Collection<BlogResponseDto>;
export let postsCollection: Collection<PostResponseDto>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  blogsCollection = db.collection<BlogResponseDto>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<PostResponseDto>(POSTS_COLLECTION_NAME);

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
