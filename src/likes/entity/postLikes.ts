import mongoose, { Model, Schema } from 'mongoose';
import { PostLikeModelStatics, PostLikeStatusDocument } from '../types';
import { LikeStatusValue } from '../../comments/models';

export const POST_LIKE_STATUS = 'PostLikeStatus';

const likeStatusSchema = new Schema<PostLikeStatusDocument>(
  {
    userId: { type: String, required: true, index: true },
    login: { type: String, required: true },
    postId: { type: String, required: true, index: true },
    status: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false },
);

// Compound unique index: one user -> one like per parent
likeStatusSchema.index({ userId: 1, postId: 1 }, { unique: true });

likeStatusSchema.statics.createPostLike = async function (
  userId: string,
  login: string,
  postId: string,
  status: LikeStatusValue,
) {
  const like = new PostLikeModel({
    userId,
    login,
    postId,
    status,
    createdAt: new Date().toISOString(),
  });
  await like.save();
  return like;
};

export const PostLikeModel = mongoose.model<
  PostLikeStatusDocument,
  Model<PostLikeStatusDocument> & PostLikeModelStatics
>(POST_LIKE_STATUS, likeStatusSchema);
