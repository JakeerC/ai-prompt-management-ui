import { Badge } from "@/components/ui/badge";
import { PROMPT_STATUS_LABELS, type PromptStatus } from "@/types/prompt";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PromptStatus;
  className?: string;
}

const statusStyles: Record<PromptStatus, string> = {
  DRAFT: "bg-[var(--status-draft)]/10 text-[var(--status-draft)] border-[var(--status-draft)]/20",
  IN_REVIEW: "bg-[var(--status-in-review)]/10 text-[var(--status-in-review)] border-[var(--status-in-review)]/20",
  APPROVED: "bg-[var(--status-approved)]/10 text-[var(--status-approved)] border-[var(--status-approved)]/20",
  PUBLISHED: "bg-[var(--status-published)]/10 text-[var(--status-published)] border-[var(--status-published)]/20",
  IN_USE: "bg-[var(--status-in-use)]/10 text-[var(--status-in-use)] border-[var(--status-in-use)]/20",
  RETIRED: "bg-[var(--status-retired)]/10 text-[var(--status-retired)] border-[var(--status-retired)]/20",
  ARCHIVED: "bg-[var(--status-archived)]/10 text-[var(--status-archived)] border-[var(--status-archived)]/20",
};

const dotStyles: Record<PromptStatus, string> = {
  DRAFT: "bg-[var(--status-draft)]",
  IN_REVIEW: "bg-[var(--status-in-review)]",
  APPROVED: "bg-[var(--status-approved)]",
  PUBLISHED: "bg-[var(--status-published)]",
  IN_USE: "bg-[var(--status-in-use)]",
  RETIRED: "bg-[var(--status-retired)]",
  ARCHIVED: "bg-[var(--status-archived)]",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border gap-1.5 px-2.5 py-0.5 whitespace-nowrap",
        statusStyles[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[status])} />
      {PROMPT_STATUS_LABELS[status]}
    </Badge>
  );
}
