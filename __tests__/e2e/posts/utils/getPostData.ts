import { PostInputDto } from '../../../../src/posts/dto';

export const getPostData = (): PostInputDto => {
  return {
    content: 'Post 1 content',
    title: 'Post 1',
    shortDescription: 'Post 1 shortDescription',
    blogId: '1',
  };
};
