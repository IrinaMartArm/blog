import { Response, Request } from 'express';
import {
  handleForbiddenResult,
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../core/resultCode/result-code';
import { injectable } from 'inversify';
import { CommentsService } from '../services/comments.service';
import { LikesService } from '../services/likes.service';
import { ParentType } from '../models/likeStatus.model';
import { CommentsQueryService } from '../services/comments.query.service';
import { jwtService } from '../../auth/applications/jwtService';

@injectable()
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private commentsQueryService: CommentsQueryService,
    private likesService: LikesService,
  ) {}

  async updateCommentHandler(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user?.id;

    const comment = await this.commentsQueryService.getComment(id, userId);

    if (!comment) {
      return handleResult(res, handleNotFoundResult());
    }

    const isOwner = userId === comment?.commentatorInfo.userId.toString();

    if (!isOwner) {
      return handleResult(res, handleForbiddenResult());
    }

    const resp = await this.commentsService.updateComment(id, req.body);
    handleResult(res, resp);
  }

  async getCommentHandler(req: Request, res: Response) {
    const id = req.params.id;

    const token = req.headers.authorization;

    const userId = jwtService.getUserIdByAccessToken(token);

    const comment = await this.commentsQueryService.getComment(id, userId);

    if (!comment) {
      return handleResult(res, handleNotFoundResult());
    }

    handleResult(res, handleSuccessResult(comment));
  }

  async deleteCommentHandler(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user?.id;

    const comment = await this.commentsQueryService.getComment(id, userId);

    if (!comment) {
      return handleResult(res, handleNotFoundResult());
    }

    if (comment.commentatorInfo.userId.toString() !== userId) {
      return handleResult(res, handleForbiddenResult());
    }

    const response = await this.commentsService.deleteComment(id);
    handleResult(res, response);
  }

  async setLikeStatusesHandler(req: Request, res: Response) {
    const commentId = req.params.id;
    const userId = req.user?.id;
    if (!userId) {
      return handleResult(res, handleUnauthorizedResult());
    }

    const result = await this.likesService.setLikeStatus(
      userId,
      commentId,
      ParentType.Comment,
      req.body.likeStatus,
    );
    handleResult(res, result);
  }
}
