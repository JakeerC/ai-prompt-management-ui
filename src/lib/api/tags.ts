import { apiClient } from "./client";
import type { PromptTag } from "@/types/prompt";

export const tagsApi = {
  getAll(): Promise<PromptTag[]> {
    return apiClient.get<PromptTag[]>("/api/v1/tags");
  },
};
