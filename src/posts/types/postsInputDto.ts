export type PostInputDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type BlogPostInputDto = Omit<PostInputDto, 'blogId'>;

export type CommentInputDto = {
  content: string;
};
