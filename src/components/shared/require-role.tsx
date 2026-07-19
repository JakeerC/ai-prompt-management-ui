"use client";

import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/types/auth";
import type { ReactNode } from "react";

interface RequireRoleProps {
  role: UserRole;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequireRole({ role, children, fallback = null }: RequireRoleProps) {
  const { hasRole, loading } = useAuth();

  if (loading) return null;

  if (hasRole(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
