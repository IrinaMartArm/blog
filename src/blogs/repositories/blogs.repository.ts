import { BlogsData } from '../types';
import { BlogInputDto } from '../dto';
import { blogsCollection, postsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';
import { BlogsQueryInput, PaginationAndSorting } from '../../core';

export const blogsRepository = {
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

  async createBlog(blog: BlogsData): Promise<WithId<BlogsData>> {
    const insertResult = await blogsCollection.insertOne(blog);
    return { ...blog, _id: insertResult.insertedId };
  },

  async getBlogById(id: string): Promise<WithId<BlogsData> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async deleteBlog(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Blog not exist');
    }
    return;
  },

  async updateBlog(id: string, dto: BlogInputDto): Promise<void> {
    const updatedResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updatedResult.matchedCount < 1) {
      throw new Error('Update failed');
    }

    return;
  },

  async getPostsByBlogId(id: string, query: PaginationAndSorting<string>) {
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
