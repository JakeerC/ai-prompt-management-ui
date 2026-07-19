import { Badge } from "@/components/ui/badge";
import { APPROVAL_STATUS_LABELS, type ApprovalStatus } from "@/types/approval";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, AlertCircle, MinusCircle } from "lucide-react";

interface ApprovalBadgeProps {
  status: ApprovalStatus;
  className?: string;
}

const approvalConfig: Record<ApprovalStatus, { style: string; icon: React.ElementType }> = {
  NOT_REQUIRED: {
    style: "bg-muted/50 text-muted-foreground border-transparent",
    icon: MinusCircle,
  },
  PENDING: {
    style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  APPROVED: {
    style: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
  CHANGES_REQUESTED: {
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: AlertCircle,
  },
};

export function ApprovalBadge({ status, className }: ApprovalBadgeProps) {
  const config = approvalConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border gap-1.5 px-2.5 py-0.5 whitespace-nowrap",
        config.style,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {APPROVAL_STATUS_LABELS[status]}
    </Badge>
  );
}
