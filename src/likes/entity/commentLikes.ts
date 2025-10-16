import { LikeStatusValue } from '../../comments/models';
import mongoose, { Model, Schema } from 'mongoose';
import { CommentLikeModelStatics, CommentLikesDocument } from '../types';

export const COMMENT_LIKE_STATUS = 'CommentLikeStatus';

const likeStatusSchema = new Schema<CommentLikesDocument>(
  {
    userId: { type: String, required: true, index: true },
    commentId: { type: String, required: true, index: true },
    status: { type: String, required: true, enum: LikeStatusValue },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false },
);

likeStatusSchema.index({ userId: 1, commentId: 1 }, { unique: true });

likeStatusSchema.statics.createCommentLike = function (
  userId: string,
  commentId: string,
  status: LikeStatusValue,
) {
  return new CommentLikeModel({
    commentId,
    status,
    userId,
    createdAt: new Date().toISOString(),
  });
};

export const CommentLikeModel = mongoose.model<
  CommentLikesDocument,
  Model<CommentLikesDocument> & CommentLikeModelStatics
>(COMMENT_LIKE_STATUS, likeStatusSchema);
