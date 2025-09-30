import { Request, Response } from 'express';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';
import { BaseQueryInput, HttpStatus } from '../../../core';
import { commentsQueryRepository } from '../../../comments/repositories/comments.queryRepositiry';
import { createQuery } from '../../../utils/createDefaultQuery';
import { createDefaultQuery } from '../../../core/middlewares/validations/query_validation.middleware';
import { commentsMapper } from '../mappers/commentsMapper';

const defaultQuery = createDefaultQuery({});

export const getPostCommentsHandler = async (req: Request, res: Response) => {
  const postId = req.params.id;
  const searchQuery: BaseQueryInput = createQuery(req.query, defaultQuery);
  const post = await postsQueryRepository.getPost(postId);

  if (!post) {
    return res.status(HttpStatus.NotFound).json({ error: 'Post not found' });
  }

  const { items, totalCount } =
    await commentsQueryRepository.findCommentsByPostId(postId, searchQuery);

  const mappedComments = commentsMapper(
    items,
    totalCount,
    searchQuery.pageNumber,
    searchQuery.pageSize,
  );

  return res.status(HttpStatus.Ok).send(mappedComments);
};
