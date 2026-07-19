// Generic API response envelope returned by the backend
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
}

// Paginated response wrapper
export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Pageable request params
export interface PageableParams {
  page?: number;
  size?: number;
  sort?: string;
}
