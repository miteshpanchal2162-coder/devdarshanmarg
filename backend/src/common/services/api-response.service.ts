import { ApiResponse, PaginatedResponse, PaginationMeta } from "../interfaces/api-response.interface";

export function createApiResponse<T>(message: string, data: T): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

export function createPaginatedResponse<T>(
  items: T[],
  meta: PaginationMeta,
): ApiResponse<PaginatedResponse<T>> {
  return createApiResponse("List fetched successfully", {
    items,
    meta,
  });
}
