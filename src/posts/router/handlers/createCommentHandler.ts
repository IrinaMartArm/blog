import { Request, Response } from 'express';
import { commentsService } from '../../../comments/services/comments.service';
import { commentsQueryRepository } from '../../../comments/repositories/comments.queryRepositiry';
import { HttpStatus } from '../../../core';
import { commentMap } from '../../../comments/mappers/commentMap';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';

export const createCommentHandler = async (req: Request, res: Response) => {
  const postId = req.params.id;

  const post = await postsQueryRepository.getPost(postId);
  if (!post) return res.sendStatus(HttpStatus.NotFound);

  if (!req.user) {
    return res.status(400).json({});
  }
  const commentId = await commentsService.createComment(
    req.body,
    req.user,
    postId,
  );
  const comment = await commentsQueryRepository.findCommentById(commentId);
  if (!comment) {
    return res.status(400).json({});
  }
  const mappedComment = commentMap(comment);
  return res.status(HttpStatus.Created).send(mappedComment);
};
