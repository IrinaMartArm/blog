import { BlogsData } from '../types';
import { BlogInputDto } from '../dto';
import { ObjectId } from 'mongodb';
import { BlogModel } from '../../db/mongo.db';

export const blogsRepository = {
  async createBlog(blog: BlogsData): Promise<{ id: string }> {
    const insertResult = await BlogModel.create(blog);
    return { id: insertResult._id.toString() };
  },

  async deleteBlog(id: string): Promise<boolean> {
    const deleteResult = await BlogModel.deleteOne({
      _id: new ObjectId(id),
    });
    return deleteResult.deletedCount === 1;
  },

  async updateBlog(id: string, dto: BlogInputDto): Promise<boolean> {
    const updatedResult = await BlogModel.updateOne(
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

    return updatedResult.matchedCount === 1;
  },
};
