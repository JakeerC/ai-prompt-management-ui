import { PromptStatus } from "./prompt";

export type AuditAction =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "SUBMITTED_FOR_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED"
  | "PUBLISHED"
  | "RETIRED"
  | "ARCHIVED"
  | "VERSION_CREATED"
  | "TAG_ADDED"
  | "TAG_REMOVED"
  | "CATEGORY_CHANGED"
  | "VARIABLE_ADDED"
  | "VARIABLE_REMOVED"
  | "USAGE_RECORDED";

export interface PromptAudit {
  id: string;
  promptId: string;
  versionId: string | null;
  action: AuditAction;
  actorId: string;
  actorRole: string;
  fromStatus: PromptStatus | null;
  toStatus: PromptStatus | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  createdBy: string;
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATED: "Created",
  UPDATED: "Updated",
  DELETED: "Deleted",
  SUBMITTED_FOR_REVIEW: "Submitted for Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHANGES_REQUESTED: "Changes Requested",
  PUBLISHED: "Published",
  RETIRED: "Retired",
  ARCHIVED: "Archived",
  VERSION_CREATED: "Version Created",
  TAG_ADDED: "Tag Added",
  TAG_REMOVED: "Tag Removed",
  CATEGORY_CHANGED: "Category Changed",
  VARIABLE_ADDED: "Variable Added",
  VARIABLE_REMOVED: "Variable Removed",
  USAGE_RECORDED: "Usage Recorded",
};
