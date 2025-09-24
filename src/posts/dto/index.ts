export type PostInputDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type BlogPostInputDto = Omit<PostInputDto, 'blogId'>;
