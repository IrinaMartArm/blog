import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
import { CommentInputDto } from '../../posts/types/postsInputDto';
import { UserViewModel } from '../../users/types/viewModel';

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};

export type LikesInfo = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatusValue;
};

export enum LikeStatusValue {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

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

export interface CommentModelStatics {
  createComment(
    dto: CommentInputDto,
    user: UserViewModel,
    postId: string,
  ): Promise<CommentDocument>;
}
