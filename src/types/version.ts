export interface PromptVersion {
  id: string;
  promptId: string;
  versionNumber: number;
  content: string;
  changeSummary: string | null;
  previousVersionId: string | null;
  current: boolean;
  createdAt: string;
  createdBy: string;
}
