import { PostsRepository } from '../repositories/posts.repository';
import { PostInputDto } from '../types/postsInputDto';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { injectable } from 'inversify';
import { PostModel } from '../entity/posts.Model';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { LikeStatusValue } from '../../comments/models';

@injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: PostInputDto) {
    const blog = await this.blogsRepository.getBlog(dto.blogId);

    if (!blog) {
      return handleNotFoundResult();
    }

    const post = await PostModel.createPost(dto, dto.blogId, blog.name);
    await post.save();
    return post._id.toString();
  }

  async deletePost(id: string) {
    const resp = await this.postsRepository.deletePost(id);
    if (!resp) {
      return handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }

  async updatePost(id: string, dto: PostInputDto) {
    const post = await this.postsRepository.getPost(id);

    if (!post) {
      return handleNotFoundResult();
    }

    post.content = dto.content;
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;

    await post.save();

    return handleNoContentResult(null);
  }

  async setLikeStatus(
    userId: string,
    login: string,
    postId: string,
    status: LikeStatusValue,
  ) {
    const post = await this.postsRepository.getPost(postId);
    if (!post) {
      return handleNotFoundResult();
    }
    await post.setLikeStatus(userId, login, status);
    return handleNoContentResult(null);
  }
}
