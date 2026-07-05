export type ApiError = {
  message: string;
  statusCode?: number;
};

export type PaginatedMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
