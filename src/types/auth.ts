export type UserRole = "ADMIN" | "REVIEWER" | "AUTHOR" | "VIEWER";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  ADMIN: 4,
  REVIEWER: 3,
  AUTHOR: 2,
  VIEWER: 1,
};

export function hasMinRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrator",
  REVIEWER: "Reviewer",
  AUTHOR: "Author",
  VIEWER: "Viewer",
};
