import { injectable } from 'inversify';
import { LikesRepository } from '../repositories/likes.repository';
import { CommentsRepository } from '../repositories/comments.repositiry';
import { LikeStatusValue } from '../models';
import { ParentType } from '../models/likeStatus.model';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';

@injectable()
export class LikesService {
  constructor(
    private likesRepository: LikesRepository,
    private commentRepository: CommentsRepository,
  ) {}

  async getMyStatus(commentId: string, userId?: string) {
    if (!userId) return LikeStatusValue.None;

    const like = await this.likesRepository.findLike(userId, commentId);
    return like ? like.status : LikeStatusValue.None;
  }

  async setLikeStatus(
    userId: string,
    parentId: string,
    parentType: ParentType,
    status: LikeStatusValue,
  ) {
    if (parentType === ParentType.Comment) {
      const commentExists =
        await this.commentRepository.commentExists(parentId);
      if (!commentExists) {
        return handleNotFoundResult();
      }
    }

    const like = await this.likesRepository.findLike(userId, parentId);

    if (like && like.status === status) return handleNoContentResult(null);

    if (status === LikeStatusValue.None && like) {
      await this.likesRepository.remove(userId, parentId);
    } else {
      await this.likesRepository.upsert(userId, parentId, parentType, status);
    }

    const { likes, dislikes } = await this.likesRepository.count(parentId);

    if (parentType === ParentType.Comment) {
      const result = await this.commentRepository.updateCounts(
        parentId,
        likes,
        dislikes,
      );
      if (!result) return handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }
}
