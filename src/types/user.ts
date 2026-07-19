import type { UserRole } from "./auth";

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  lastSignInAt: string | null;
}

export interface PaginatedUserResponse {
  users: UserDto[];
  totalElements: number;
  page: number;
  size: number;
}
