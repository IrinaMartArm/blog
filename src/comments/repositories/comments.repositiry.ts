import 'reflect-metadata';
import { ObjectId } from 'mongodb';
import { CommentDocument, CommentModel } from '../models/comment.model';
import { injectable } from 'inversify';

@injectable()
export class CommentsRepository {
  async save(comment: CommentDocument) {
    return comment.save();
  }

  async getComment(commentId: string) {
    return CommentModel.findOne({
      _id: commentId,
    });
  }

  async delete(commentId: string): Promise<boolean> {
    const result = await CommentModel.deleteOne({
      _id: new ObjectId(commentId),
    }).exec();
    return result.deletedCount === 1;
  }

  // async update(commentId: string, content: string): Promise<boolean> {
  //   const result = await CommentModel.updateOne(
  //     { _id: new ObjectId(commentId) },
  //     { $set: { content } },
  //   ).exec();
  //   return result.matchedCount === 1;
  // }

  // async updateCounts(
  //   commentId: string,
  //   likesCount: number,
  //   dislikesCount: number,
  // ) {
  //   const result = await CommentModel.updateOne(
  //     { _id: new ObjectId(commentId) },
  //     {
  //       $set: { likesCount, dislikesCount },
  //     },
  //   ).exec();
  //   return result.matchedCount === 1;
  // }
}
