export type PostResponseDto = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: PostData[];
};

export type PostData = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type PostViewModel = {
  id: string;
} & PostData;
