import { apiClient } from "./client";
import type { PromptUsage, RecordUsageRequest } from "@/types/usage";
import type { PagedResponse, PageableParams } from "@/types/api";

export const usageApi = {
  record(promptId: string, data: RecordUsageRequest): Promise<PromptUsage> {
    return apiClient.post<PromptUsage>(`/api/v1/prompts/${promptId}/usage`, data);
  },

  getHistory(promptId: string, params?: PageableParams): Promise<PagedResponse<PromptUsage>> {
    return apiClient.get<PagedResponse<PromptUsage>>(
      `/api/v1/prompts/${promptId}/usage`,
      params as unknown as Record<string, unknown>
    );
  },
};
