export type BlogsData = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type BlogResponseDto = {
  page: number;
  pageSize: number;
  pagesCount: number;
  totalCount: number;
  items: BlogsData[];
};

export type BlogViewModel = {
  id: string;
} & BlogsData;
