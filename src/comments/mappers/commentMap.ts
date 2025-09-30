import { CommentDbModel } from '../types/modelDb';
import { CommentViewModel } from '../types/viewModel';

export const commentMap = (comment: CommentDbModel): CommentViewModel => {
  return {
    id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    },
  };
};
