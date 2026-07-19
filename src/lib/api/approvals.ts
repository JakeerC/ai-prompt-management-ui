import { apiClient } from "./client";
import type { PromptApproval, ApprovePromptRequest, RejectPromptRequest } from "@/types/approval";

export const approvalsApi = {
  submit(promptId: string, changeSummary?: string): Promise<void> {
    return apiClient.post(`/api/v1/prompts/${promptId}/approvals/submit`, changeSummary ? { changeSummary } : undefined);
  },

  approve(promptId: string, data?: ApprovePromptRequest): Promise<void> {
    return apiClient.post(`/api/v1/prompts/${promptId}/approvals/approve`, data);
  },

  reject(promptId: string, data: RejectPromptRequest): Promise<void> {
    return apiClient.post(`/api/v1/prompts/${promptId}/approvals/reject`, data);
  },

  getHistory(promptId: string): Promise<PromptApproval[]> {
    return apiClient.get<PromptApproval[]>(`/api/v1/prompts/${promptId}/approvals`);
  },
};
