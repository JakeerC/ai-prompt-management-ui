import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS, type UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";
import { ShieldAlert, ShieldCheck, Shield, Eye } from "lucide-react";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

const roleConfig: Record<UserRole, { style: string; icon: React.ElementType }> = {
  ADMIN: {
    style: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: ShieldAlert,
  },
  REVIEWER: {
    style: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    icon: ShieldCheck,
  },
  AUTHOR: {
    style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Shield,
  },
  VIEWER: {
    style: "bg-muted text-muted-foreground border-transparent",
    icon: Eye,
  },
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border gap-1 px-2 py-0.5",
        config.style,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {ROLE_LABELS[role]}
    </Badge>
  );
}
