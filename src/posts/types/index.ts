export type PostResponseDto = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModel = {
  id: string;
} & PostResponseDto;
