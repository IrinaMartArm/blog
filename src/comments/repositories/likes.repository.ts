import { injectable } from 'inversify';
import { LikeStatusModel, ParentType } from '../models/likeStatus.model';
import { LikeStatusValue } from '../models';

@injectable()
export class LikesRepository {
  async findLike(userId: string, parentId: string) {
    return await LikeStatusModel.findOne({ userId, parentId }).lean().exec();
  }

  async upsert(
    userId: string,
    parentId: string,
    parentType: ParentType,
    status: Omit<LikeStatusValue, LikeStatusValue.None>,
  ) {
    // upsert: if exists update, else insert
    return LikeStatusModel.updateOne(
      { userId, parentId },
      {
        $set: {
          status,
          parentType,
        },
        // $setOnInsert для полей, которые устанавливаются только при создании
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true },
    ).exec();
  }

  async remove(userId: string, parentId: string) {
    return LikeStatusModel.deleteOne({ userId, parentId }).exec();
  }

  async count(parentId: string) {
    const likes = await LikeStatusModel.countDocuments({
      parentId,
      status: LikeStatusValue.Like,
    }).exec();
    const dislikes = await LikeStatusModel.countDocuments({
      parentId,
      status: LikeStatusValue.Dislike,
    }).exec();
    return { likes, dislikes };
  }

  async findUserLikesForParents(userId: string, parentIds: string[]) {
    return LikeStatusModel.find({ userId, parentId: { $in: parentIds } })
      .lean()
      .exec();
  }
}
