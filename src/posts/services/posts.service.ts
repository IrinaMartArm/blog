import { postsRepository } from '../repositories/posts.repository';
import { PostInputDto } from '../types/postsInputDto';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { injectable } from 'inversify';

@injectable()
export class PostsService {
  async createPost(dto: PostInputDto) {
    const newPost = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: 'some name',
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.createPost(newPost);
  }

  async deletePost(id: string) {
    const resp = await postsRepository.deletePost(id);
    if (!resp) {
      return handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }

  async updatePost(id: string, dto: PostInputDto) {
    const resp = await postsRepository.updatePost(id, dto);
    if (!resp) {
      return handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }
}
