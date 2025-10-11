import { Request, Response } from 'express';
import { blogsService } from '../../aplication/blogs.service';
import { blogsQueryRepository } from '../../repositories/blogs.query.repository';
import {
  handleCreatedResult,
  handleNotFoundResult,
  handleResult,
} from '../../../core/resultCode/result-code';
import { PostsQueryRepository } from '../../../posts/repositories/postsQuery.repository';

const postsQueryRepository = new PostsQueryRepository();

export const createNewPostHandler = async (req: Request, res: Response) => {
  const blogId = req.params.id;
  const blog = await blogsQueryRepository.getBlogById(blogId);

  if (!blog) {
    handleResult(res, handleNotFoundResult());
    return;
  }

  const postId = await blogsService.createPost(req.body, blogId, blog.name);
  const newPost = postsQueryRepository.getPost(postId.id);

  handleResult(res, handleCreatedResult(newPost));
};
