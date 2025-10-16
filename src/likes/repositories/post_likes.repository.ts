import { injectable } from 'inversify';
import { LikeStatusValue } from '../../comments/models';

import { PostLikeStatusDocument } from '../types';
import { PostLikeModel } from '../entity/postLikes';
import { FlattenMaps } from 'mongoose';

@injectable()
export class Post_likesRepository {
  async findLike(userId: string, postId: string) {
    return PostLikeModel.findOne({ userId, postId }).exec();
  }

  async findNewestLikes(
    postId: string,
  ): Promise<FlattenMaps<PostLikeStatusDocument>[]> {
    return PostLikeModel.find({
      postId,
      status: LikeStatusValue.Like,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }

  async findPostsNewestLikes(
    postIds: string[],
  ): Promise<Map<string, FlattenMaps<PostLikeStatusDocument>[]>> {
    const result = await PostLikeModel.aggregate([
      {
        $match: {
          postId: { $in: postIds },
          status: LikeStatusValue.Like,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$postId', // группируем по полю postId
          newestLikes: { $push: '$$ROOT' }, // собираем все документы в массив
          // $$ROOT - ссылка на весь документ
        },
      },
      {
        $project: {
          postId: '$_id', // переименовываем _id в postId
          newestLikes: { $slice: ['$newestLikes', 3] }, // берем первые 3 элемента
          _id: 0, // исключаем поле _id из результата
        },
      },
    ]).exec();

    const likesMap = new Map();
    result.map((el) => {
      likesMap.set(el.postId, el.newestLikes);
    });

    return likesMap;
  }

  async findUserLikes(userId: string, postIds: string[]) {
    const likes = await PostLikeModel.find({
      userId,
      postId: { $in: postIds },
    })
      .lean()
      .exec();

    const map = new Map<string, LikeStatusValue>();
    for (const like of likes) {
      map.set(like.postId, like.status);
    }

    return map;
  }

  // async save(like: PostLikeStatusDocument) {
  //   return like.save();
  // }
  //
  // async remove(userId: string, postId: string) {
  //   return PostLikeModel.deleteOne({ userId, postId }).exec();
  // }
  //
  // async count(postId: string) {
  //   const likes = await PostLikeModel.countDocuments({
  //     postId,
  //     status: LikeStatusValue.Like,
  //   }).exec();
  //   const dislikes = await PostLikeModel.countDocuments({
  //     postId,
  //     status: LikeStatusValue.Dislike,
  //   }).exec();
  //   return { likes, dislikes };
  // }

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
}
