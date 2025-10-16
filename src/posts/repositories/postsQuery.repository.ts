import 'reflect-metadata';
import {
  PostDbDto,
  PostsViewModel,
  PostViewModel,
} from '../types/postsViewModel';
import { WithId } from 'mongodb';
import { BaseQueryInput } from '../../core';
import { injectable } from 'inversify';
import { PostModel } from '../entity/posts.Model';
import { Post_likesRepository } from '../../likes/repositories/post_likes.repository';
import { LikeStatusValue } from '../../comments/models';
import { FlattenMaps } from 'mongoose';
import { PostLikeStatusDocument } from '../../likes/types';

@injectable()
export class PostsQueryRepository {
  constructor(private post_likesRepository: Post_likesRepository) {}
  async getAllPosts(
    query: BaseQueryInput,
    userId?: string,
  ): Promise<PostsViewModel> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter: Record<string, any> = {};

    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments({});

    const postIds = posts.map((post) => post._id.toString());

    let likes: Map<string, LikeStatusValue> = new Map();
    if (userId) {
      likes = await this.post_likesRepository.findUserLikes(userId, postIds);
    }

    const postsNewestLikes =
      await this.post_likesRepository.findPostsNewestLikes(postIds);

    const items = posts.map((post) => {
      const postId = post._id.toString();
      const myStatus = likes.get(postId) || LikeStatusValue.None;
      const newestLikes = postsNewestLikes.get(postId) || [];
      return this.mapPostToViewModel(post, myStatus, newestLikes);
    });

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }

  async getPost(
    postId: string,
    userId?: string,
  ): Promise<PostViewModel | null> {
    const post = await PostModel.findOne({ _id: postId }).lean();

    if (!post) return null;

    let myStatus = LikeStatusValue.None;
    if (userId) {
      const like = await this.post_likesRepository.findLike(userId, postId);
      myStatus = like ? like.status : LikeStatusValue.None;
    }

    const newestLikes = await this.post_likesRepository.findNewestLikes(postId);

    return this.mapPostToViewModel(post, myStatus, newestLikes);
  }

  async getPostsByBlogId(
    blogId: string,
    query: BaseQueryInput,
    userId?: string,
  ) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;

    const posts = await PostModel.find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();

    const totalCount = await PostModel.countDocuments({ blogId });

    const postIds = posts.map((post) => post._id.toString());

    let likes: Map<string, LikeStatusValue> = new Map();
    if (userId) {
      likes = await this.post_likesRepository.findUserLikes(userId, postIds);
    }

    const postsNewestLikes =
      await this.post_likesRepository.findPostsNewestLikes(postIds);

    const items = posts.map((post) => {
      const postId = post._id.toString();
      const myStatus = likes.get(postId) || LikeStatusValue.None;
      const newestLikes = postsNewestLikes.get(postId) || [];
      return this.mapPostToViewModel(post, myStatus, newestLikes);
    });

    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items,
    };
  }

  mapPostToViewModel(
    post: WithId<PostDbDto>,
    status: LikeStatusValue,
    newestLikes: FlattenMaps<PostLikeStatusDocument>[],
  ): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        myStatus: status,
        newestLikes: newestLikes.map((l) => ({
          userId: l.userId,
          addedAt: l.createdAt,
          login: l.login,
        })),
      },
    };
  }
}
