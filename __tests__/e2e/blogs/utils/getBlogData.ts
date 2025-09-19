import { BlogInputDto } from '../../../../src/blogs/dto';

export const getBlogData = (): BlogInputDto => {
  return {
    name: 'Blog name',
    description: 'Blog description',
    websiteUrl: 'https://samurai.it-incubator.io',
  };
};
