import { BlogsData } from '../types';
import { BlogInputDto } from '../dto';
import { BlogPostInputDto } from '../../posts/types/postsInputDto';
import { injectable } from 'inversify';
import { BlogsRepository } from '../repositories/blogs.repository';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { PostModel } from '../../posts/entity/posts.Model';

@injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}
  async createBlog(dto: BlogInputDto) {
    const newBlog: BlogsData = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return this.blogsRepository.createBlog(newBlog);
  }

  async updateBlog(id: string, dto: BlogInputDto) {
    return this.blogsRepository.updateBlog(id, dto);
  }

  async deleteBlog(id: string) {
    const result = this.blogsRepository.deleteBlog(id);
    if (!result) {
      handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }

  async createPost(
    dto: BlogPostInputDto,
    blogId: string,
    blogName: string,
  ): Promise<{ id: string }> {
    const newPost = await PostModel.createPost(dto, blogId, blogName);
    await newPost.save();
    return { id: newPost._id.toString() };
  }
}
