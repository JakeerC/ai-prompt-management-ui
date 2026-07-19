import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/lib/api/audit";
import type { PageableParams } from "@/types/api";

export function useAuditTrail(promptId: string, params?: PageableParams) {
  return useQuery({
    queryKey: ["audit", promptId, params],
    queryFn: () => auditApi.getTrail(promptId, params),
    enabled: !!promptId,
  });
}
