import mongoose, { Schema, Model } from 'mongoose';
import { ObjectId } from 'mongodb';

const COMMENTS_COLLECTION_NAME = 'comments';

export interface CommentDoc {
  content: string;
  postId: ObjectId;
  commentatorInfo: { userId: ObjectId; userLogin: string };
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
}

const CommentSchema = new Schema<CommentDoc>(
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
  { versionKey: false },
);

export const CommentModel: Model<CommentDoc> =
  mongoose.models.Comment ||
  mongoose.model<CommentDoc>(COMMENTS_COLLECTION_NAME, CommentSchema);
