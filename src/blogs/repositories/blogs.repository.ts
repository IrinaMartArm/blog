import { BlogResponseDto } from '../types';
import { BlogInputDto } from '../dto';
import { blogsCollection } from '../../db/mongo.db';
import { ObjectId, WithId } from 'mongodb';

export const blogsRepository = {
  async getAllBlogs(): Promise<WithId<BlogResponseDto>[]> {
    return blogsCollection.find().toArray();
  },

  async createBlog(blog: BlogResponseDto): Promise<WithId<BlogResponseDto>> {
    // db.blogs.push(blog);
    const insertResult = await blogsCollection.insertOne(blog);
    return { ...blog, _id: insertResult.insertedId };
  },

  async getBlogById(id: string): Promise<WithId<BlogResponseDto> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
    // return db.blogs.find((b) => b.id === id) ?? null;
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
    // const blog = db.blogs.find((b) => b.id === id);
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
