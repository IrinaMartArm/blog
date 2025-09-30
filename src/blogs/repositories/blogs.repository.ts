import { BlogsData } from '../types';
import { BlogInputDto } from '../dto';
import { blogsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const blogsRepository = {
  async createBlog(blog: BlogsData): Promise<WithId<BlogsData>> {
    const insertResult = await blogsCollection.insertOne(blog);
    return { ...blog, _id: insertResult.insertedId };
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
};
