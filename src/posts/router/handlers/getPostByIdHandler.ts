import { Response, Request } from 'express';
import { postsService } from '../../services/posts.service';
import { postsQueryRepository } from '../../repositories/postsQuery.repository';
import {
  handleNotFoundResult,
  handleResult,
  handleSuccessResult,
} from '../../../core/resultCode/result-code';

export const getPostByIdHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const post = await postsQueryRepository.getPost(id);

  if (!post) {
    handleResult(res, handleNotFoundResult());
    return;
  }

  handleResult(res, handleSuccessResult(post));
};

export const createPostHandler = async (req: Request, res: Response) => {
  const postId = await postsService.createPost(req.body);

  const post = await postsQueryRepository.getPost(postId.id);

  if (!post) {
    handleNotFoundResult();
  }

  handleResult(res, handleSuccessResult(post));
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const response = await postsService.updatePost(id, req.body);

  handleResult(res, response);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const id = req.params.id;

  const response = await postsService.deletePost(id);
  handleResult(res, response);
};
