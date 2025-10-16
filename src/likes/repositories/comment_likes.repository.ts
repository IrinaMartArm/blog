import { injectable } from 'inversify';
import { LikeStatusValue } from '../../comments/models';
import { CommentLikeModel } from '../entity/commentLikes';
import { CommentLikesDocument } from '../types';

@injectable()
export class Comment_likesRepository {
  async findLike(userId: string, parentId: string) {
    return await CommentLikeModel.findOne({ userId, parentId }).exec();
  }

  async save(like: CommentLikesDocument) {
    return like.save();
  }

  // async upsert(
  //   userId: string,
  //   parentId: string,
  //   parentType: ParentType,
  //   status: Omit<LikeStatusValue, LikeStatusValue.None>,
  // ) {
  //   // upsert: if exists update, else insert
  //   return LikeStatusModel.updateOne(
  //     { userId, parentId },
  //     {
  //       $set: {
  //         status,
  //         parentType,
  //       },
  //       // $setOnInsert для полей, которые устанавливаются только при создании
  //       $setOnInsert: {
  //         createdAt: new Date().toISOString(),
  //       },
  //     },
  //     { upsert: true },
  //   ).exec();
  // }

  async remove(userId: string, parentId: string) {
    return CommentLikeModel.deleteOne({ userId, parentId }).exec();
  }

  async count(parentId: string) {
    const likes = await CommentLikeModel.countDocuments({
      parentId,
      status: LikeStatusValue.Like,
    }).exec();
    const dislikes = await CommentLikeModel.countDocuments({
      parentId,
      status: LikeStatusValue.Dislike,
    }).exec();
    return { likes, dislikes };
  }

  async findUserLikes(userId: string, parentIds: string[]) {
    const likes = await CommentLikeModel.find({
      userId,
      parentId: { $in: parentIds },
    })
      .lean()
      .exec();

    const map = new Map<string, LikeStatusValue>();
    for (const like of likes) {
      map.set(like.commentId, like.status);
    }

    return map;
  }
}
