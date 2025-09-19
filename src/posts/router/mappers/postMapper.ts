import { PostResponseDto, PostViewModel } from '../../types';
import { WithId } from 'mongodb';

export const postMapper = (post: WithId<PostResponseDto>): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});
