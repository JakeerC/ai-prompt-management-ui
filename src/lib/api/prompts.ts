import { apiClient } from "./client";
import type { Prompt, CreatePromptRequest, UpdatePromptRequest, PromptSearchCriteria } from "@/types/prompt";
import type { PagedResponse } from "@/types/api";

export const promptsApi = {
  create(data: CreatePromptRequest): Promise<Prompt> {
    return apiClient.post<Prompt>("/api/v1/prompts", data);
  },

  get(id: string): Promise<Prompt> {
    return apiClient.get<Prompt>(`/api/v1/prompts/${id}`);
  },

  update(id: string, data: UpdatePromptRequest): Promise<Prompt> {
    return apiClient.put<Prompt>(`/api/v1/prompts/${id}`, data);
  },

  delete(id: string): Promise<void> {
    return apiClient.delete(`/api/v1/prompts/${id}`);
  },

  search(criteria: PromptSearchCriteria): Promise<PagedResponse<Prompt>> {
    return apiClient.get<PagedResponse<Prompt>>(
      "/api/v1/search/prompts",
      criteria as unknown as Record<string, unknown>
    );
  },
};
