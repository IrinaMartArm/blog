import { ObjectId } from 'mongodb';
import { BaseQueryInput } from '../../core';
import { CommentDoc, CommentModel } from '../models/comment.model';
import { FlattenMaps, Types } from 'mongoose';
import { injectable } from 'inversify';
import { LikeStatusValue } from '../models';
import { Comment_likesRepository } from '../../likes/repositories/comment_likes.repository';

@injectable()
export class CommentsQueryRepository {
  constructor(private likesRepository: Comment_likesRepository) {}

  async findCommentsByPostId(
    userId: string,
    postId: string,
    query: BaseQueryInput,
  ) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const comments = await CommentModel.find({ postId: new ObjectId(postId) })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await CommentModel.countDocuments({
      postId: new ObjectId(postId),
    });

    const ids = comments.map((c) => c.id);
    const likesMap = await this.likesRepository.findUserLikes(userId, ids);

    const items = comments.map((comment) => {
      const myStatus =
        likesMap.get(comment._id.toString()) ?? LikeStatusValue.None;
      return this.mapCommentToViewModel(comment, myStatus);
    });

    return { items, totalCount };
  }

  async findCommentById(commentId: string, userId?: string) {
    const comment = await CommentModel.findOne({
      _id: new ObjectId(commentId),
    }).lean();

    if (!comment) return null;
    let myStatus = LikeStatusValue.None;
    if (userId) {
      const like = await this.likesRepository.findLike(userId, commentId);
      myStatus = like ? like.status : LikeStatusValue.None;
    }

    return this.mapCommentToViewModel(comment, myStatus);
  }

  mapCommentToViewModel(
    comment: FlattenMaps<CommentDoc> &
      Required<{
        _id: Types.ObjectId;
      }> & {
        __v: number;
      },
    myStatus: LikeStatusValue,
  ) {
    return {
      id: comment._id.toString(),
      postId: comment.postId.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId.toString(),
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus,
      },
    };
  }
}
