import { ObjectId } from 'mongodb';

export type CommentInfoDb = {
  userId: ObjectId;
  userLogin: string;
};

export type CommentDbModel = {
  _id: ObjectId;
  content: string;
  postId: ObjectId;
  commentatorInfo: CommentInfoDb;
  createdAt: string;
};
