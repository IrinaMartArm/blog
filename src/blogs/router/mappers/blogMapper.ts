import { BlogsData, BlogViewModel } from '../../types';
import { WithId } from 'mongodb';

export const blogMapper = (blog: WithId<BlogsData>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  isMembership: blog.isMembership,
  createdAt: blog.createdAt,
});
