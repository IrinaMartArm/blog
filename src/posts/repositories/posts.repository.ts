import { PostData } from '../types/postsViewModel';
import { PostInputDto } from '../types/postsInputDto';
import { ObjectId } from 'mongodb';
import { PostModel } from '../../db/mongo.db';

export const postsRepository = {
  async createPost(post: PostData): Promise<{ id: string }> {
    const insertedPost = await PostModel.insertOne(post);
    return { id: insertedPost._id.toString() };
  },

  async updatePost(id: string, dto: PostInputDto): Promise<boolean> {
    const updatedResult = await PostModel.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    return updatedResult.matchedCount === 1;
  },

  async deletePost(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({
      _id: new ObjectId(id),
    });

    return deleteResult.deletedCount === 1;
  },
};
