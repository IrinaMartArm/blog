import { Response, Request } from 'express';
import { commentsQueryRepository } from '../../repositories/comments.queryRepositiry';
import { HttpStatus } from '../../../core';
import { commentsService } from '../../services/comments.service';

export const updateCommentHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const comment = await commentsQueryRepository.findCommentById(id);

  if (!comment) {
    return res
      .status(HttpStatus.NotFound)
      .send({ message: 'Comment not found' });
  }

  const userId = req.user!.id;
  const isOwner = userId === comment.commentatorInfo.userId.toString();

  if (!isOwner) {
    return res
      .status(HttpStatus.Forbidden)
      .send({ message: 'You are not owner' });
  }

  await commentsService.updateComment(id, req.body);
  res.sendStatus(HttpStatus.NoContent);
};
