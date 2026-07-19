export interface PromptUsage {
  id: string;
  promptId: string;
  versionId: string;
  callerService: string;
  callerId: string | null;
  executionId: string | null;
  usedAt: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  createdBy: string;
}

export interface RecordUsageRequest {
  versionId: string;
  callerService: string;
  callerId?: string;
  executionId?: string;
  usedAt?: string;
  metadata?: Record<string, unknown>;
}
