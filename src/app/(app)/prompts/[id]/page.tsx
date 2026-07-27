"use client";

import { use } from "react";
import { usePrompt, useDeletePrompt } from "@/hooks/use-prompts";
import { useAuditTrail } from "@/hooks/use-audit";
import { useApprovalHistory, useSubmitForReview } from "@/hooks/use-approvals";
import { useVersionHistory } from "@/hooks/use-versions";
import { StatusBadge } from "@/components/shared/status-badge";
import { ImpactBadge } from "@/components/shared/impact-badge";
import { ApprovalBadge } from "@/components/shared/approval-badge";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { RequireRole } from "@/components/shared/require-role";
import { Button } from "@/components/ui/button";
import { MdxEditor } from "@/components/shared/mdx-editor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow, format } from "date-fns";
import { Edit2, Trash2, GitMerge, FileText, Activity, ShieldAlert, CheckCircle2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUDIT_ACTION_LABELS } from "@/types/audit";

export default function PromptDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const { data: prompt, isLoading: loadingPrompt } = usePrompt(id);
  const { data: versions, isLoading: loadingVersions } = useVersionHistory(id);
  const { data: approvals, isLoading: loadingApprovals } = useApprovalHistory(id);
  const { data: audits, isLoading: loadingAudits } = useAuditTrail(id, { size: 10 });
  const deletePrompt = useDeletePrompt();
  const submitForReview = useSubmitForReview();

  if (loadingPrompt) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl font-bold">Prompt not found</h2>
        <p className="text-muted-foreground mt-2">The requested prompt could not be located.</p>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/prompts">Back to Library</Link>
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deletePrompt.mutateAsync(id);
      toast.success("Prompt deleted successfully");
      router.push("/prompts");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete prompt");
    }
  };

  const handleSubmitForReview = async () => {
    try {
      await submitForReview.mutateAsync({ promptId: id });
      toast.success("Prompt submitted for review successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to submit prompt for review");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{prompt.name}</h2>
            <StatusBadge status={prompt.status} />
          </div>
          {prompt.description && (
            <p className="text-muted-foreground mt-1 max-w-3xl">
              {prompt.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {prompt.status === "DRAFT" && (
            <RequireRole role="AUTHOR">
              <Button 
                variant="default"
                onClick={handleSubmitForReview}
                disabled={submitForReview.isPending}
                className="bg-primary text-primary-foreground shadow hover:bg-primary/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitForReview.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            </RequireRole>
          )}
          <RequireRole role="AUTHOR">
            <Button asChild variant="outline" className="glass">
              <Link href={`/prompts/${id}/edit`}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Prompt
              </Link>
            </Button>
          </RequireRole>
          
          <RequireRole role="ADMIN">
            <ConfirmDialog
              title="Delete Prompt?"
              description="Are you sure you want to permanently delete this prompt? This action cannot be undone."
              confirmText="Delete Permanently"
              variant="destructive"
              onConfirm={handleDelete}
              trigger={
                <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10 glass">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              }
            />
          </RequireRole>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <ImpactBadge impact={prompt.businessImpact} />
        {prompt.category && (
          <Badge variant="secondary" className="font-normal">
            Folder: {prompt.category.name}
          </Badge>
        )}
        <Badge variant="outline" className="font-normal bg-background/50">
          v{prompt.currentVersionNumber}
        </Badge>
        {prompt.tags?.map((tag) => (
          <Badge key={tag.id} variant="outline" className="font-normal text-muted-foreground">
            #{tag.name}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="glass inline-flex flex-wrap h-auto rounded-xl p-1 mb-6 w-full md:w-fit">
          <TabsTrigger value="content" className="py-2.5 rounded-lg flex-1 md:flex-none px-4"><FileText className="w-4 h-4 mr-2" /> Content</TabsTrigger>
          <TabsTrigger value="versions" className="py-2.5 rounded-lg flex-1 md:flex-none px-4"><GitMerge className="w-4 h-4 mr-2" /> Versions</TabsTrigger>
          <TabsTrigger value="approvals" className="py-2.5 rounded-lg flex-1 md:flex-none px-4"><CheckCircle2 className="w-4 h-4 mr-2" /> Approvals</TabsTrigger>
          <TabsTrigger value="audit" className="py-2.5 rounded-lg flex-1 md:flex-none px-4"><ShieldAlert className="w-4 h-4 mr-2" /> Audit Trail</TabsTrigger>
          <TabsTrigger value="usage" className="py-2.5 rounded-lg flex-1 md:flex-none px-4"><Activity className="w-4 h-4 mr-2" /> Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 outline-none">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
              <CardTitle className="text-lg">Template Content</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <MdxEditor markdown={prompt.content} readOnly />
            </CardContent>
          </Card>

          {prompt.modelHint && (
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground font-medium">Model Hint</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="px-2 py-1 bg-muted rounded text-sm">{prompt.modelHint}</code>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="versions" className="outline-none">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>Track changes and diffs across revisions.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={loadingVersions}
                data={versions || []}
                columns={[
                  { header: "Version", cell: (v) => <Badge>v{v.versionNumber}</Badge> },
                  { header: "Summary", accessorKey: "changeSummary" },
                  { header: "Author", accessorKey: "createdBy" },
                  { header: "Date", cell: (v) => format(new Date(v.createdAt), "MMM d, yyyy h:mm a") },
                ]}
                emptyState={<p className="text-muted-foreground py-4 text-center">No version history available.</p>}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="outline-none">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Approval Workflow</CardTitle>
              <CardDescription>Review and manage approval requests.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={loadingApprovals}
                data={approvals || []}
                columns={[
                  { header: "Level", cell: (a) => `Level ${a.level}` },
                  { header: "Status", cell: (a) => <ApprovalBadge status={a.approvalStatus} /> },
                  { header: "Reviewer", accessorKey: "reviewerId" },
                  { header: "Comments", accessorKey: "comments" },
                  { header: "Date", cell: (a) => a.reviewedAt ? format(new Date(a.reviewedAt), "MMM d, yyyy h:mm a") : "-" },
                ]}
                emptyState={<p className="text-muted-foreground py-4 text-center">No approval history available.</p>}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="outline-none">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Comprehensive log of all actions taken on this prompt.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                loading={loadingAudits}
                data={audits?.content || []}
                columns={[
                  { header: "Action", cell: (a) => <span className="font-medium">{AUDIT_ACTION_LABELS[a.action]}</span> },
                  { header: "Actor", cell: (a) => `${a.actorId} (${a.actorRole})` },
                  { 
                    header: "Status Change", 
                    cell: (a) => a.fromStatus && a.toStatus ? (
                      <span className="text-xs">
                        <span className="text-muted-foreground">{a.fromStatus}</span> 
                        <span className="mx-1">→</span> 
                        <span>{a.toStatus}</span>
                      </span>
                    ) : "-"
                  },
                  { header: "Time", cell: (a) => formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) },
                ]}
                emptyState={<p className="text-muted-foreground py-4 text-center">No audit trail available.</p>}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="outline-none">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Execution Usage</CardTitle>
              <CardDescription>Metrics on how this prompt is being utilized in production.</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                Usage charts and execution logs will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
