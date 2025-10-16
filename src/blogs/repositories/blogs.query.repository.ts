import { BlogsData, BlogViewModel } from '../types';
import { BlogModel } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogsQueryInput } from '../../core';
import { injectable } from 'inversify';

@injectable()
export class BlogsQueryRepository {
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
  }

  async getBlogById(id: string): Promise<BlogViewModel | null> {
    const blog = await BlogModel.findOne({ _id: new ObjectId(id) }).lean();
    return blog ? this.mapBlogToView(blog) : null;
  }

  mapBlogToView(blog: WithId<BlogsData>): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
