import { BlogsData } from '../types';
import { blogsCollection, postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BaseQueryInput, BlogsQueryInput } from '../../core';

export const blogsQueryRepository = {
  async getAllBlogs(
    query: BlogsQueryInput,
  ): Promise<{ items: WithId<BlogsData>[]; totalCount: number }> {
    const { pageSize, pageNumber, searchNameTerm, sortDirection, sortBy } =
      query;

    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const items = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(pageSize))
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async getBlogById(id: string): Promise<WithId<BlogsData> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async getPostsByBlogId(id: string, query: BaseQueryInput) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = { blogId: id };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(Number(pageSize))
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);
    return { items, totalCount };
  },
};
