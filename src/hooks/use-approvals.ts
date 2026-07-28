import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { approvalsApi } from "@/lib/api/approvals";
import type { ApprovePromptRequest, RejectPromptRequest, AssignReviewerRequest } from "@/types/approval";

export function useApprovalHistory(promptId: string) {
  return useQuery({
    queryKey: ["approvals", promptId],
    queryFn: () => approvalsApi.getHistory(promptId),
    enabled: !!promptId,
  });
}

export function useSubmitForReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ promptId, changeSummary }: { promptId: string; changeSummary?: string }) =>
      approvalsApi.submit(promptId, changeSummary),
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["approvals", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useApprove() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ promptId, data }: { promptId: string; data?: ApprovePromptRequest }) =>
      approvalsApi.approve(promptId, data),
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["approvals", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useReject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ promptId, data }: { promptId: string; data: RejectPromptRequest }) =>
      approvalsApi.reject(promptId, data),
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["approvals", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useAssignReviewer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ promptId, data }: { promptId: string; data: AssignReviewerRequest }) =>
      approvalsApi.assign(promptId, data),
    onSuccess: (_, { promptId }) => {
      queryClient.invalidateQueries({ queryKey: ["prompt", promptId] });
      queryClient.invalidateQueries({ queryKey: ["approvals", promptId] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}
