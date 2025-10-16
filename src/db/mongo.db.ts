import { Collection, Db, MongoClient } from 'mongodb';
import mongoose, { Schema } from 'mongoose';
import { BlogsData } from '../blogs/types';
import { SETTINGS } from '../core/settings';
import { UserDbModel } from '../users/types/modelDb';
import { RequestLogDbModel } from '../auth/types/authDbModel';
import { initIndexes } from './initIndexes';

const BLOGS_COLLECTION_NAME = 'blogs';
const USERS_COLLECTION_NAME = 'users';
// const TOKENS_COLLECTION_NAME = 'token';
const REQUESTS_COLLECTION_NAME = 'requests';

export const BlogSchema = new Schema<BlogsData>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
    isMembership: { type: Boolean, default: false },
  },
  { versionKey: false },
);

export const BlogModel = mongoose.model<BlogsData>(
  BLOGS_COLLECTION_NAME,
  BlogSchema,
);

export let client: MongoClient;
// export let tokenCollection: Collection<RefreshTokenDbModel>;
// export let blogsCollection: Collection<BlogsData>;
// export let postsCollection: Collection<PostData>;
export let usersCollection: Collection<UserDbModel>;
// export let commentsCollection: Collection<CommentDbModel>;
export let requestsCollection: Collection<RequestLogDbModel>;
// export let sessionCollection: Collection<SessionsDbModel>;

export const runDB = async (url: string): Promise<void> => {
  client = new MongoClient(url);
  const db: Db = client.db(SETTINGS.DB_NAME);

  // blogsCollection = db.collection<BlogsData>(BLOGS_COLLECTION_NAME);
  // postsCollection = db.collection<PostData>(POSTS_COLLECTION_NAME);
  usersCollection = db.collection<UserDbModel>(USERS_COLLECTION_NAME);
  // commentsCollection = db.collection<CommentDbModel>(COMMENTS_COLLECTION_NAME);
  // tokenCollection = db.collection<RefreshTokenDbModel>(TOKENS_COLLECTION_NAME);
  requestsCollection = db.collection<RequestLogDbModel>(
    REQUESTS_COLLECTION_NAME,
  );

  try {
    await mongoose.connect(url, { autoIndex: false });
    await client.connect();
    await db.command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    // await initIndexes();
  } catch (err) {
    await client.close();
    throw new Error('Error connecting to MongoDB');
  }
  await initIndexes();
};

export const stopDB = async (): Promise<void> => {
  await client.close();
  await mongoose.disconnect();
};
