import 'reflect-metadata';
import { PostData, PostViewModel } from '../types/postsViewModel';
import { ObjectId, WithId } from 'mongodb';
import { PostModel } from '../../db/mongo.db';
import { BaseQueryInput } from '../../core';
import { injectable } from 'inversify';

@injectable()
export class PostsQueryRepository {
  async getAllPosts(
    query: BaseQueryInput,
  ): Promise<{ items: PostViewModel[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter: Record<string, any> = {};

    const posts = await PostModel.find(filter)
      .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await PostModel.countDocuments({});

    const items = posts.map(this.mapPostToViewModel);

    return { items, totalCount };
  }

  async getPost(id: string): Promise<PostViewModel | null> {
    const resp = await PostModel.findOne({ _id: new ObjectId(id) }).lean();

    return resp ? this.mapPostToViewModel(resp) : null;
  }

  mapPostToViewModel(post: WithId<PostData>): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  }
}
