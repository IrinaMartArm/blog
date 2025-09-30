import { postsRepository } from '../repositories/posts.repository';
import { PostInputDto } from '../types/postsInputDto';

export const postsService = {
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
