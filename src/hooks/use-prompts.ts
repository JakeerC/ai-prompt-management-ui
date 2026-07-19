import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promptsApi } from "@/lib/api/prompts";
import type { CreatePromptRequest, UpdatePromptRequest, PromptSearchCriteria } from "@/types/prompt";

export function usePrompt(id: string) {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: () => promptsApi.get(id),
    enabled: !!id,
  });
}

export function useSearchPrompts(criteria: PromptSearchCriteria) {
  return useQuery({
    queryKey: ["prompts", "search", criteria],
    queryFn: () => promptsApi.search(criteria),
  });
}

export function useCreatePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePromptRequest) => promptsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useUpdatePrompt(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePromptRequest) => promptsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompt", id] });
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}

export function useDeletePrompt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => promptsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prompts"] });
    },
  });
}
