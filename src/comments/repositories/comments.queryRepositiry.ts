import { ObjectId } from 'mongodb';
import { BaseQueryInput } from '../../core';
import { CommentDoc, CommentModel } from '../models/comment.model';
import { FlattenMaps, Types } from 'mongoose';
import { injectable } from 'inversify';

@injectable()
export class CommentsQueryRepository {
  async findCommentsByPostId(postId: string, query: BaseQueryInput) {
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

    const items = comments ? comments.map(this.mapCommentToViewModel) : null;

    return { items, totalCount };
  }

  async findCommentById(id: string) {
    const comment = await CommentModel.findOne({
      _id: new ObjectId(id),
    }).lean();
    return comment ? this.mapCommentToViewModel(comment) : null;
  }

  mapCommentToViewModel(
    comment: FlattenMaps<CommentDoc> &
      Required<{
        _id: Types.ObjectId;
      }> & {
        __v: number;
      },
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
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
    };
  }
}
