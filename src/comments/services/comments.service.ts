import { CommentInputDto } from '../../posts/types/postsInputDto';
import { ObjectId } from 'mongodb';
import { UserViewModel } from '../../users/types/viewModel';
import {
  handleNoContentResult,
  handleNotFoundResult,
} from '../../core/resultCode/result-code';
import { CommentDoc } from '../models/comment.model';
import { CommentsRepository } from '../repositories/comments.repositiry';
import { injectable } from 'inversify';

@injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async createComment(
    dto: CommentInputDto,
    user: UserViewModel,
    postId: string,
  ) {
    const comment: CommentDoc = {
      createdAt: new Date().toISOString(),
      content: dto.content,
      postId: new ObjectId(postId),
      commentatorInfo: {
        userId: new ObjectId(user.id),
        userLogin: user.login,
      },
      likesCount: 0,
      dislikesCount: 0,
    };
    return await this.commentsRepository.create(comment);
  }

  async deleteComment(id: string) {
    const resp = await this.commentsRepository.delete(id);

    if (!resp) {
      handleNotFoundResult();
    }

    return handleNoContentResult(null);
  }

  async updateComment(id: string, comment: CommentInputDto) {
    const result = await this.commentsRepository.update(id, comment.content);
    if (!result) {
      handleNotFoundResult();
    }
    return handleNoContentResult(null);
  }
}
