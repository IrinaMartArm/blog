import { LikeStatusValue } from '../../comments/models';
import { HydratedDocument } from 'mongoose';
import { BlogPostInputDto } from './postsInputDto';

export type PostsViewModel = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: PostViewModel[];
};

export type PostDbDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  likesCount: number;
  dislikesCount: number;
};

export type PostViewModel = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusValue;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };
};

export type PostDocument = HydratedDocument<PostDbDto, PostMethods>;

interface PostMethods {
  setLikeStatus: (
    userId: string,
    login: string,
    status: LikeStatusValue,
  ) => Promise<void>;
}

export interface PostModelStatics {
  createPost(
    dto: BlogPostInputDto,
    blogId: string,
    blogName: string,
  ): Promise<PostDocument>;
}
