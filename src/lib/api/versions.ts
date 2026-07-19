import { apiClient } from "./client";
import type { PromptVersion } from "@/types/version";

export const versionsApi = {
  getHistory(promptId: string): Promise<PromptVersion[]> {
    return apiClient.get<PromptVersion[]>(`/api/v1/prompts/${promptId}/versions`);
  },

  getCurrent(promptId: string): Promise<PromptVersion> {
    return apiClient.get<PromptVersion>(`/api/v1/prompts/${promptId}/versions/current`);
  },

  getByNumber(promptId: string, versionNumber: number): Promise<PromptVersion> {
    return apiClient.get<PromptVersion>(`/api/v1/prompts/${promptId}/versions/${versionNumber}`);
  },
};
