import { PostData } from '../types/postsViewModel';
import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../db/mongo.db';
import { BaseQueryInput } from '../../core';

export const postsQueryRepository = {
  async getAllPosts(
    query: BaseQueryInput,
  ): Promise<{ items: WithId<PostData>[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter: Record<string, any> = {};

    const items = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments({});
    return { items, totalCount };
  },

  async getPost(id: string): Promise<WithId<PostData> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },
};
