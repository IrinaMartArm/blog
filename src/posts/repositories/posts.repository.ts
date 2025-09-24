import { PostData } from '../types';
import { PostInputDto } from '../dto';
import { ObjectId, WithId } from 'mongodb';
import { postsCollection } from '../../db/mongo.db';
import { PaginationAndSorting } from '../../core';

export const postsRepository = {
  async getAllPosts(
    query: PaginationAndSorting<string>,
  ): Promise<{ items: WithId<PostData>[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const skip = (pageNumber - 1) * pageSize;

    const filter: Record<string, any> = {};

    console.log('query', query);

    const items = await postsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection, createdAt: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postsCollection.countDocuments({});
    return { items, totalCount };
  },

  async getPost(id: string): Promise<WithId<PostData> | null> {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async createPost(post: PostData): Promise<WithId<PostData>> {
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
