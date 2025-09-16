import { PostResponseDto } from '../types';
import { db } from '../../db';
import { PostInputDto } from '../dto';

export const postsRepository = {
  getAllPosts(): PostResponseDto[] {
    return db.posts;
  },

  getPost(id: string): PostResponseDto | null {
    return db.posts.find((p) => p.id === id) ?? null;
  },

  createPost(post: PostResponseDto): PostResponseDto {
    db.posts.push(post);
    return post;
  },

  updatePost(id: string, dto: PostInputDto): void {
    const post = db.posts.find((post) => post.id === id);
    if (!post) {
      throw new Error('Post not exist');
    }

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;

    return;
  },

  deletePost(id: string): void {
    const index = db.posts.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Post not exist');
    }

    db.posts.splice(index, 1);
    return;
  },
};
