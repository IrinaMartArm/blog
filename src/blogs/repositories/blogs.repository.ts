import { BlogsResponseDto } from '../types';
import { db } from '../../db';
import { BlogInputDto } from '../dto';

export const blogsRepository = {
  getAllBlogs(): BlogsResponseDto[] {
    return db.blogs;
  },

  createBlog(blog: BlogsResponseDto): BlogsResponseDto {
    db.blogs.push(blog);
    return blog;
  },

  getBlogById(id: string): BlogsResponseDto | null {
    return db.blogs.find((b) => b.id === id) ?? null;
  },

  deleteBlog(id: string): void {
    const index = db.blogs.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new Error('Blog not exist');
    }

    db.blogs.splice(index, 1);
    return;
  },

  updateBlog(id: string, dto: BlogInputDto): void {
    const blog = db.blogs.find((b) => b.id === id);

    if (!blog) {
      throw new Error('Blog not exist');
    }

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    return;
  },
};
