import { Badge } from "@/components/ui/badge";
import { BUSINESS_IMPACT_LABELS, type BusinessImpact } from "@/types/prompt";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";

interface ImpactBadgeProps {
  impact: BusinessImpact;
  className?: string;
}

const impactStyles: Record<BusinessImpact, string> = {
  LOW: "bg-[var(--impact-low)]/10 text-[var(--impact-low)] border-[var(--impact-low)]/20",
  MEDIUM: "bg-[var(--impact-medium)]/10 text-[var(--impact-medium)] border-[var(--impact-medium)]/20",
  HIGH: "bg-[var(--impact-high)]/10 text-[var(--impact-high)] border-[var(--impact-high)]/20",
  CRITICAL: "bg-[var(--impact-critical)]/10 text-[var(--impact-critical)] border-[var(--impact-critical)]/20",
};

export function ImpactBadge({ impact, className }: ImpactBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border gap-1 px-2 py-0.5",
        impactStyles[impact],
        className
      )}
    >
      <Activity className="w-3 h-3" />
      {BUSINESS_IMPACT_LABELS[impact]}
    </Badge>
  );
}
