import { apiClient } from "./client";
import type { PaginatedUserResponse } from "@/types/user";

export const usersApi = {
  getUsers: (page = 1, size = 20) =>
    apiClient.get<PaginatedUserResponse>("/admin/users", { page, size }),

  updateRole: (userId: string, role: string) =>
    apiClient.put<void>(`/admin/users/${userId}/role`, { role }),
};
