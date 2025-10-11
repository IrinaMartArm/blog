import mongoose, { Schema, Document, Model } from 'mongoose';
import { LikeStatusValue } from './index';

export enum ParentType {
  Comment = 'Comment',
  Post = 'Post',
}

export interface LikeStatusDoc {
  userId: string;
  parentId: string; // commentId or postId
  parentType: ParentType;
  status: LikeStatusValue;
  createdAt: string;
}

const LikeStatusSchema = new Schema<LikeStatusDoc>(
  {
    userId: { type: String, required: true, index: true },
    parentId: { type: String, required: true, index: true },
    parentType: { type: String, required: true, enum: ['Comment', 'Post'] },
    status: { type: String, required: true, enum: ['Like', 'Dislike'] },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { versionKey: false },
);

// Compound unique index: one user -> one like per parent
LikeStatusSchema.index({ userId: 1, parentId: 1 }, { unique: true });

export const LikeStatusModel: Model<LikeStatusDoc> =
  mongoose.models.LikeStatus ||
  mongoose.model<LikeStatusDoc>('LikeStatus', LikeStatusSchema);
