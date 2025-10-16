import mongoose, { Schema, Model, HydratedDocument } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CommentInputDto } from '../../posts/types/postsInputDto';
import { UserViewModel } from '../../users/types/viewModel';
import { LikeStatusValue } from './index';
import { CommentLikeModel } from '../../likes/entity/commentLikes';

const COMMENTS_COLLECTION_NAME = 'comments';

export interface CommentDoc {
  content: string;
  postId: ObjectId;
  commentatorInfo: { userId: ObjectId; userLogin: string };
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
}

interface CommentMethods {
  setLikeStatus(userId: string, status: LikeStatusValue): Promise<void>;
  getMyStatus(userId?: string): LikeStatusValue;
}

export type CommentDocument = HydratedDocument<CommentDoc, CommentMethods>;

interface CommentModelStatics {
  createComment(
    dto: CommentInputDto,
    user: UserViewModel,
    postId: string,
  ): Promise<CommentDocument>;
}

const commentSchema = new Schema<CommentDocument>(
  {
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, required: true, index: true },
    commentatorInfo: {
      userId: { type: ObjectId, required: true },
      userLogin: { type: String, required: true },
    },
    createdAt: { type: String, default: () => new Date().toISOString() },
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  },
);

commentSchema.methods.setLikeStatus = async function (
  userId: string,
  status: LikeStatusValue,
) {
  const comment = this;
  const commentId = comment._id;
  const like = await CommentLikeModel.findOne({
    userId,
    commentId,
  });

  if (like && like.status === status) return;

  if (status === LikeStatusValue.None) {
    if (like) {
      if (like.status === LikeStatusValue.Like) {
        comment.likesCount--;
      } else {
        comment.dislikesCount--;
      }
      CommentLikeModel.deleteOne({ userId, commentId });
    }
    await comment.save();
    return;
  }

  if (!like) {
    await CommentLikeModel.createCommentLike(userId, commentId, status);
    if (status === LikeStatusValue.Like) {
      comment.likesCount++;
    } else {
      comment.dislikesCount++;
    }
    await comment.save();
    return;
  }

  if (
    status === LikeStatusValue.Like &&
    like.status === LikeStatusValue.Dislike
  ) {
    comment.likesCount++;
    comment.dislikesCount--;
  } else if (
    status === LikeStatusValue.Dislike &&
    like.status === LikeStatusValue.Like
  ) {
    comment.likesCount--;
    comment.dislikesCount++;
  }
  like.status = status;
  await comment.save();
  await like.save();
};

commentSchema.methods.getMyStatus = async function (userId?: string) {
  if (!userId) return LikeStatusValue.None;
  const like = await CommentLikeModel.findOne({
    userId,
    commentId: this._id,
  });
  return like ? like.status : LikeStatusValue.None;
};

commentSchema.statics.createComment = function (
  dto: CommentInputDto,
  user: UserViewModel,
  postId: string,
) {
  return new CommentModel({
    createdAt: new Date().toISOString(),
    content: dto.content,
    postId: new ObjectId(postId),
    commentatorInfo: {
      userId: new ObjectId(user.id),
      userLogin: user.login,
    },
    likesCount: 0,
    dislikesCount: 0,
  });
};

export const CommentModel = mongoose.model<
  CommentDocument,
  Model<CommentDocument> & CommentModelStatics
>(COMMENTS_COLLECTION_NAME, commentSchema);
