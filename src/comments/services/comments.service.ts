import { CommentInputDto } from '../../posts/types/postsInputDto';
import { UserViewModel } from '../../users/types/viewModel';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { CommentModel } from '../models/comment.model';
import { CommentsRepository } from '../repositories/comments.repositiry';
import { injectable } from 'inversify';
import { LikeStatusValue } from '../models';

@injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(
    dto: CommentInputDto,
    user: UserViewModel,
    postId: string,
  ) {
    const comment = await CommentModel.createComment(dto, user, postId);

    await this.commentsRepository.save(comment);
    return comment._id.toString();
  }

  async deleteComment(id: string) {
    const isDeleted = await this.commentsRepository.delete(id);

    if (!isDeleted) {
      return handleNotFoundResult();
    }

    return handleNoContentResult(null);
  }

  async updateComment(id: string, comment: CommentInputDto) {
    const commentDocument = await this.commentsRepository.getComment(id);
    if (!commentDocument) {
      return handleNotFoundResult();
    }
    commentDocument.content = comment.content;
    await this.commentsRepository.save(commentDocument);

    return handleNoContentResult(null);
  }

  async setLikeStatus(
    userId: string,
    commentId: string,
    status: LikeStatusValue,
  ) {
    const comment = await this.commentsRepository.getComment(commentId);
    if (!comment) {
      return handleNotFoundResult();
    }

    await comment.setLikeStatus(userId, status);

    return handleNoContentResult(null);
  }
}
