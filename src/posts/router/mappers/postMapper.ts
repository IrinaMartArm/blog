import {
  PostData,
  PostResponseDto,
  PostViewModel,
} from '../../types/postsViewModel';
import { WithId } from 'mongodb';

export const postsMapper = (
  posts: WithId<PostData>[],
  totalCount: number,
  pageNumber: number,
  pageSize: number,
): PostResponseDto => ({
  pagesCount: Math.ceil(totalCount / pageSize),
  page: pageNumber,
  pageSize,
  totalCount,
  items: posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  })),
});

export const postMapper = (post: WithId<PostData>): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
});
