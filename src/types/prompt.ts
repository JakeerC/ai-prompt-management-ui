export type PromptStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "IN_USE"
  | "RETIRED"
  | "ARCHIVED";

export type BusinessImpact = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface PromptCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  parentId: string | null;
  displayOrder: number;
}

export interface PromptTag {
  id: string;
  name: string;
  slug: string;
}

export interface PromptVariable {
  id: string;
  name: string;
  variableType: string;
  description: string | null;
  defaultValue: string | null;
  required: boolean;
  displayOrder: number;
}

export interface Prompt {
  id: string;
  name: string;
  description: string | null;
  content: string;
  modelHint: string | null;
  status: PromptStatus;
  approvalStatus: string;
  businessImpact: BusinessImpact;
  ownerId: string;
  currentVersionNumber: number;
  category: PromptCategory | null;
  tags: PromptTag[];
  variables: PromptVariable[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CreatePromptRequest {
  name: string;
  description?: string;
  content: string;
  businessImpact: BusinessImpact;
  categoryId?: string;
  modelHint?: string;
  tagSlugs?: string[];
  variables?: PromptVariableRequest[];
}

export interface UpdatePromptRequest {
  name?: string;
  description?: string;
  content?: string;
  businessImpact?: BusinessImpact;
  categoryId?: string;
  modelHint?: string;
  tagSlugs?: string[];
  variables?: PromptVariableRequest[];
}

export interface PromptVariableRequest {
  name: string;
  variableType: string;
  description?: string;
  defaultValue?: string;
  required: boolean;
  displayOrder: number;
}

export interface PromptSearchCriteria {
  name?: string;
  status?: PromptStatus;
  businessImpact?: BusinessImpact;
  ownerId?: string;
  categoryId?: string;
  tagSlug?: string;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export const PROMPT_STATUS_LABELS: Record<PromptStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In Review",
  APPROVED: "Approved",
  PUBLISHED: "Published",
  IN_USE: "In Use",
  RETIRED: "Retired",
  ARCHIVED: "Archived",
};

export const BUSINESS_IMPACT_LABELS: Record<BusinessImpact, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};
