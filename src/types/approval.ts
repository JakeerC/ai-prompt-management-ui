export type ApprovalStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export interface PromptApproval {
  id: string;
  promptId: string;
  versionId: string;
  approvalStatus: ApprovalStatus;
  level: number;
  reviewerId: string | null;
  comments: string | null;
  reviewedAt: string | null;
  createdAt: string;
  createdBy: string;
}

export interface ApprovePromptRequest {
  comments?: string;
}

export interface RejectPromptRequest {
  comments: string;
}

export interface AssignReviewerRequest {
  reviewerId: string;
}

export interface SubmitForReviewRequest {
  changeSummary?: string;
}

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  NOT_REQUIRED: "Not Required",
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CHANGES_REQUESTED: "Changes Requested",
};
