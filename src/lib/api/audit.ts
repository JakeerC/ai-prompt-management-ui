import { apiClient } from "./client";
import type { PromptAudit } from "@/types/audit";
import type { PagedResponse, PageableParams } from "@/types/api";

export const auditApi = {
  getTrail(promptId: string, params?: PageableParams): Promise<PagedResponse<PromptAudit>> {
    return apiClient.get<PagedResponse<PromptAudit>>(
      `/api/v1/prompts/${promptId}/audit`,
      params as unknown as Record<string, unknown>
    );
  },
};
