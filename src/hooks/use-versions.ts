import { useQuery } from "@tanstack/react-query";
import { versionsApi } from "@/lib/api/versions";

export function useVersionHistory(promptId: string) {
  return useQuery({
    queryKey: ["versions", promptId],
    queryFn: () => versionsApi.getHistory(promptId),
    enabled: !!promptId,
  });
}

export function useCurrentVersion(promptId: string) {
  return useQuery({
    queryKey: ["versions", promptId, "current"],
    queryFn: () => versionsApi.getCurrent(promptId),
    enabled: !!promptId,
  });
}
