import { commentsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { CommentDbModel } from '../types/modelDb';
import { BaseQueryInput } from '../../core';

export const commentsQueryRepository = {
  async findCommentsByPostId(postId: string, query: BaseQueryInput) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const items = await commentsCollection
      .find({ postId: new ObjectId(postId) })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentsCollection.countDocuments({
      postId: new ObjectId(postId),
    });

    return { items, totalCount };
  },

  async findCommentById(id: string): Promise<CommentDbModel | null> {
    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
    return comment ?? null;
  },
};
