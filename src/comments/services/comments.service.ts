import { CommentInputDto } from '../../posts/types/postsInputDto';
import { commentsRepository } from '../repositories/comments.repositiry';
import { ObjectId } from 'mongodb';
import { CommentDbModel } from '../types/modelDb';
import { UserViewModel } from '../../users/types/viewModel';

export const commentsService = {
  createComment: async (
    dto: CommentInputDto,
    user: UserViewModel,
    postId: string,
  ) => {
    const comment: CommentDbModel = {
      _id: new ObjectId(),
      createdAt: new Date().toISOString(),
      content: dto.content,
      postId: new ObjectId(postId),
      commentatorInfo: {
        userId: new ObjectId(user.id),
        userLogin: user.login,
      },
    };
    return await commentsRepository.create(comment);
  },

  deleteComment: async (id: string) => {
    return await commentsRepository.delete(id);
  },

  updateComment: async (id: string, comment: CommentInputDto) => {
    return commentsRepository.update(id, comment.content);
  },
};
