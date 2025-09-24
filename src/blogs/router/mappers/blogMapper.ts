import { BlogResponseDto, BlogsData, BlogViewModel } from '../../types';
import { WithId } from 'mongodb';

export const blogsMapper = (
  blogs: WithId<BlogsData>[],
  pageNumber: number,
  pageSize: number,
  totalCount: number,
): BlogResponseDto => ({
  pagesCount: Math.ceil(totalCount / pageSize),
  page: pageNumber,
  pageSize,
  totalCount,
  items: blogs.map((blog) => ({
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    isMembership: blog.isMembership,
    createdAt: blog.createdAt,
  })),
});

export const blogMapper = (blog: WithId<BlogsData>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  isMembership: blog.isMembership,
  createdAt: blog.createdAt,
});
