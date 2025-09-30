import { commentsQueryRepository } from '../../repositories/comments.queryRepositiry';
import { commentsService } from '../../services/comments.service';
import { HttpStatus } from '../../../core';
import { Response, Request } from 'express';

export const deleteCommentHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const userId = req.user?.id;

  const comment = await commentsQueryRepository.findCommentById(id);

  if (!comment) {
    return res
      .status(HttpStatus.NotFound)
      .send({ message: 'Comment not found' });
  }

  if (comment.commentatorInfo.userId.toString() !== userId) {
    return res
      .status(HttpStatus.Forbidden)
      .send({ message: 'You are not authorized to delete this comment' });
  }

  await commentsService.deleteComment(id);
  res.sendStatus(HttpStatus.NoContent);
};
