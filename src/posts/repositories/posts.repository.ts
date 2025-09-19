import { PostResponseDto } from '../types';
import { PostInputDto } from '../dto';
import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../db/mongo.db';

export const postsRepository = {
  async getAllPosts(): Promise<WithId<PostResponseDto>[]> {
    return postsCollection.find().toArray();
  },

  async getPost(id: string): Promise<WithId<PostResponseDto> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async createPost(post: PostResponseDto): Promise<WithId<PostResponseDto>> {
    const insertedPost = await postsCollection.insertOne(post);
    return { ...post, _id: insertedPost.insertedId };
  },

  async updatePost(id: string, dto: PostInputDto): Promise<void> {
    const updatedResult = await postsCollection.updateOne(
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
    if (updatedResult.matchedCount < 1) {
      throw new Error('Post not exist');
    }

    return;
  },

  async deletePost(id: string): Promise<void> {
    const deleteResult = await postsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Post not exist');
    }

    return;
  },
};
