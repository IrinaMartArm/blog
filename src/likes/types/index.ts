import { LikeStatusValue } from '../../comments/models';
import { HydratedDocument } from 'mongoose';

export interface CommentLikeStatusDto {
  userId: string;
  commentId: string;
  status: LikeStatusValue;
  createdAt: string;
}

interface CommentLikeMethods {}

export interface CommentLikeModelStatics {
  createCommentLike(
    userId: string,
    commentId: string,
    status: LikeStatusValue,
  ): Promise<CommentLikesDocument>;
}

export type CommentLikesDocument = HydratedDocument<
  CommentLikeStatusDto,
  CommentLikeMethods
>;

//posts

export interface PostLikeStatusDto {
  userId: string;
  login: string;
  postId: string;
  status: LikeStatusValue;
  createdAt: string;
}

export interface PostLikeModelStatics {
  createPostLike(
    userId: string,
    login: string,
    postId: string,
    status: LikeStatusValue,
  ): Promise<PostLikeStatusDocument>;
}

export type PostLikeStatusDocument = HydratedDocument<PostLikeStatusDto>;
