import { commentsCollection } from '../../db/mongo.db';
import { ObjectId } from 'mongodb';
import { CommentDbModel } from '../types/modelDb';

export const commentsRepository = {
  async create(comment: CommentDbModel): Promise<string> {
    const result = await commentsCollection.insertOne(comment);
    return result.insertedId.toString();
  },

  async delete(commentId: string): Promise<boolean> {
    const result = await commentsCollection.deleteOne({
      _id: new ObjectId(commentId),
    });
    return result.deletedCount === 1;
  },

  async update(commentId: string, content: string): Promise<boolean> {
    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(commentId) },
      { $set: { content } },
    );
    return result.matchedCount === 1;
  },
};
