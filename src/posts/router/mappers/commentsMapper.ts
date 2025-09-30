import { CommentDbModel } from '../../../comments/types/modelDb';
import { CommentsViewModel } from '../../../comments/types/viewModel';

export const commentsMapper = (
  comments: CommentDbModel[],
  totalCount: number,
  page: number,
  pageSize: number,
): CommentsViewModel => ({
  totalCount,
  page,
  pageSize,
  pagesCount: Math.ceil(totalCount / pageSize),
  items: comments.map((el) => ({
    id: el._id.toString(),
    content: el.content,
    createdAt: el.createdAt,
    commentatorInfo: {
      userLogin: el.commentatorInfo.userLogin,
      userId: el.commentatorInfo.userId.toString(),
    },
  })),
});
