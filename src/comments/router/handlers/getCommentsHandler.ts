import { commentsQueryRepository } from '../../repositories/comments.queryRepositiry';
import { createErrorMessages, HttpStatus } from '../../../core';
import { Response, Request } from 'express';
import { commentMap } from '../../mappers/commentMap';

export const getCommentHandler = async (req: Request, res: Response) => {
  const id = req.params.id;
  const comment = await commentsQueryRepository.findCommentById(id);
  if (!comment) {
    return res
      .status(404)
      .send(
        createErrorMessages([
          { field: 'comment', message: 'Comment not found' },
        ]),
      );
  }
  const mappedComment = commentMap(comment);
  res.status(HttpStatus.Ok).send(mappedComment);
};
