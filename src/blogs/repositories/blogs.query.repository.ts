import { BlogsData, BlogViewModel } from '../types';
import { BlogModel, PostModel } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BaseQueryInput, BlogsQueryInput } from '../../core';

export const blogsQueryRepository = {
  async getAllBlogs(
    query: BlogsQueryInput,
  ): Promise<{ items: BlogViewModel[]; totalCount: number }> {
    const { pageSize, pageNumber, searchNameTerm, sortDirection, sortBy } =
      query;

    const skip = (+pageNumber - 1) * +pageSize;
    const filter: any = {};

    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const blogs = await BlogModel.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(pageSize))
      .lean();

    const totalCount = await BlogModel.countDocuments(filter);

    const items = blogs.map(this.mapBlogToView);

    return { items, totalCount };
  },

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) }).lean();
    return blog ? this.mapBlogToView(blog) : null;
  },

  async getPostsByBlogId(id: string, query: BaseQueryInput) {
    const { pageSize, pageNumber, sortDirection, sortBy } = query;
    const skip = (pageNumber - 1) * pageSize;
    const filter: any = { blogId: id };

    const [items, totalCount] = await Promise.all([
      PostModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(Number(pageSize))
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  mapBlogToView(blog: WithId<BlogsData>): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  },
};
