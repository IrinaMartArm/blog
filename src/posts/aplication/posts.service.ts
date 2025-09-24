import { postsRepository } from '../repositories/posts.repository';
import { WithId } from 'mongodb';
import { PostData } from '../types';
import { PostInputDto } from '../dto';
import { PaginationAndSorting } from '../../core';

export const postsService = {
  async getAllPosts(query: PaginationAndSorting<string>) {
    return postsRepository.getAllPosts(query);
  },

  async getPostById(id: string): Promise<WithId<PostData> | null> {
    return postsRepository.getPost(id);
  },

  async createPost(dto: PostInputDto) {
    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: 'some name',
      createdAt: new Date().toISOString(),
    };
    return postsRepository.createPost(newPost);
  },

  async deletePost(id: string) {
    return postsRepository.deletePost(id);
  },

  async updatePost(id: string, dto: PostInputDto) {
    return postsRepository.updatePost(id, dto);
  },
};
