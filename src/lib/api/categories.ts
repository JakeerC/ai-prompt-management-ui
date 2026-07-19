import { apiClient } from "./client";
import type { PromptCategory } from "@/types/prompt";

export const categoriesApi = {
  getAll(): Promise<PromptCategory[]> {
    return apiClient.get<PromptCategory[]>("/api/v1/categories");
  },

  get(id: string): Promise<PromptCategory> {
    return apiClient.get<PromptCategory>(`/api/v1/categories/${id}`);
  },
};
