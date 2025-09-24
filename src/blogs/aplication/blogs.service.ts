import { blogsRepository } from '../repositories/blogs.repository';
import { BlogsData } from '../types';
import { BlogInputDto } from '../dto';
import { BlogsQueryInput, PaginationAndSorting } from '../../core';
import { WithId } from 'mongodb';
import { BlogPostInputDto } from '../../posts/dto';
import { PostData } from '../../posts/types';
import { postsRepository } from '../../posts/repositories/posts.repository';

export const blogsService = {
  async getAllBlogs(
    query: BlogsQueryInput,
  ): Promise<{ items: WithId<BlogsData>[]; totalCount: number }> {
    return blogsRepository.getAllBlogs(query);
  },

  async getBlogById(id: string) {
    return blogsRepository.getBlogById(id);
  },

  async createBlog(dto: BlogInputDto) {
    const newBlog: BlogsData = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date().toISOString(),
    };
    return blogsRepository.createBlog(newBlog);
  },

  async updateBlog(id: string, dto: BlogInputDto) {
    return blogsRepository.updateBlog(id, dto);
  },

  async deleteBlog(id: string) {
    return blogsRepository.deleteBlog(id);
  },

  async createPost(
    dto: BlogPostInputDto,
    blogId: string,
    blogName: string,
  ): Promise<WithId<PostData>> {
    const newPost: PostData = {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      createdAt: new Date().toISOString(),
      blogId,
      blogName,
    };
    return postsRepository.createPost(newPost);
  },

  async getPostsByBlogId(id: string, query: PaginationAndSorting<string>) {
    return blogsRepository.getPostsByBlogId(id, query);
  },
};
