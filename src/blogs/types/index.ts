export type BlogResponseDto = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type BlogViewModel = {
  id: string;
} & BlogResponseDto;
