import { injectable } from 'inversify';
import { LikeStatusValue } from '../../comments/models';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { Post_likesRepository } from '../repositories/post_likes.repository';

@injectable()
export class Post_likesService {
  constructor(
    private likesRepository: Post_likesRepository,
    private postRepository: PostsRepository,
  ) {}

  async getMyStatus(commentId: string, userId?: string) {
    if (!userId) return LikeStatusValue.None;

    const like = await this.likesRepository.findLike(userId, commentId);
    return like ? like.status : LikeStatusValue.None;
  }

  async setLikeStatus(
    userId: string,
    login: string,
    postId: string,
    status: LikeStatusValue,
  ) {
    const post = await this.postRepository.getPost(postId);
    if (!post) {
      return handleNotFoundResult();
    }

    await post.setLikeStatus(userId, login, status);

    return handleNoContentResult(null);
  }
}
