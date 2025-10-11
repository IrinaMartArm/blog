import { injectable } from 'inversify';
import { CommentsQueryRepository } from '../repositories/comments.queryRepositiry';
import {
  handleNotFoundResult,
  handleSuccessResult,
} from '../../core/resultCode/result-code';
import { LikesService } from './likes.service';
import { BaseQueryInput } from '../../core';

@injectable()
export class CommentsQueryService {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private likesService: LikesService,
  ) {}

  async getComment(commentId: string, userId?: string) {
    const comment =
      await this.commentsQueryRepository.findCommentById(commentId);

    if (!comment) return null;

    const myStatus = await this.likesService.getMyStatus(commentId, userId);

    console.log('getComment myStatus', myStatus);

    return this.mapCommentToViewModel(comment, myStatus);
  }

  async getPostComments(userId: string, postId: string, query: BaseQueryInput) {
    const { items, totalCount } =
      await this.commentsQueryRepository.findCommentsByPostId(postId, query);

    if (!items) return handleNotFoundResult();

    const comments = await Promise.all(
      items.map(async (item) => {
        const myStatus = await this.likesService.getMyStatus(item.id, userId);
        return this.mapCommentToViewModel(item, myStatus);
      }),
    );

    return handleSuccessResult({
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount,
      items: comments,
    });
  }

  mapCommentToViewModel(comment: any, myStatus: string) {
    return {
      id: comment.id,
      content: comment.content,
      commentatorInfo: comment.commentatorInfo,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        myStatus,
      },
    };
  }
}
