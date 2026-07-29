"use client";

import { useSearchPrompts } from "@/hooks/use-prompts";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ImpactBadge } from "@/components/shared/impact-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { CheckSquare, UserPlus } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { approvalsApi } from "@/lib/api/approvals";
import { useUsers } from "@/hooks/use-users";
import { useAssignReviewer } from "@/hooks/use-approvals";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Prompt } from "@/types/prompt";

export default function ReviewQueuePage() {
  const { data: prompts, isLoading: loadingPrompts } = useSearchPrompts({
    status: "IN_REVIEW",
    size: 50,
    sortBy: "updatedAt",
    sortDir: "asc",
  });

  const promptIds = prompts?.content.map((p) => p.id) || [];

  const approvalQueries = useQueries({
    queries: promptIds.map((id) => ({
      queryKey: ["approvals", id],
      queryFn: () => approvalsApi.getHistory(id),
    })),
  });

  const isLoadingApprovals = approvalQueries.some((q) => q.isLoading);
  const isLoading = loadingPrompts || isLoadingApprovals;

  const { data: usersData, isLoading: loadingUsers } = useUsers();
  const availableReviewers = usersData?.users.filter((u) => u.role === "REVIEWER" || u.role === "ADMIN") || [];
  
  const assignMutation = useAssignReviewer();

  const assignedPrompts: Prompt[] = [];
  const unassignedPrompts: Prompt[] = [];

  if (prompts?.content && !isLoadingApprovals) {
    prompts.content.forEach((prompt, index) => {
      const approvals = approvalQueries[index].data;
      const hasAssignee = !!approvals?.find((a) => a.approvalStatus === "PENDING")?.reviewerId;
      if (hasAssignee) {
        assignedPrompts.push(prompt);
      } else {
        unassignedPrompts.push(prompt);
      }
    });
  }

  const handleAssign = async (promptId: string, reviewerId: string) => {
    try {
      await assignMutation.mutateAsync({ promptId, data: { reviewerId } });
      toast.success("Reviewer assigned successfully");
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to assign reviewer");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground mt-1">
          Prompts pending your approval based on your reviewer role.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card className="glass flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Unassigned Prompts</CardTitle>
            <CardDescription>
              These prompts need a reviewer assigned.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <DataTable
              loading={isLoading}
              data={unassignedPrompts}
              columns={[
                { header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
                { header: "Impact", cell: (p) => <ImpactBadge impact={p.businessImpact} /> },
                { header: "Submitted", cell: (p) => format(new Date(p.updatedAt), "MMM d, yyyy") },
                { 
                  header: "Assign Reviewer", 
                  cell: (p: Prompt) => (
                    <Select
                      disabled={loadingUsers || assignMutation.isPending}
                      onValueChange={(val: string | null) => val && handleAssign(p.id, val)}
                    >
                      <SelectTrigger className="w-[180px] h-8">
                        <SelectValue placeholder="Select reviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableReviewers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ),
                  className: "w-[200px]"
                },
              ]}
              emptyState={
                <EmptyState
                  icon={<UserPlus className="w-6 h-6" />}
                  title="All Assigned!"
                  description="No prompts are currently waiting for assignment."
                />
              }
            />
          </CardContent>
        </Card>

        <Card className="glass flex-1 flex flex-col">
          <CardHeader>
            <CardTitle>Assigned Prompts</CardTitle>
            <CardDescription>
              Prompts currently assigned for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <DataTable
              loading={isLoading}
              data={assignedPrompts}
              columns={[
                { header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
                { header: "Impact", cell: (p) => <ImpactBadge impact={p.businessImpact} /> },
                { header: "Submitted", cell: (p) => format(new Date(p.updatedAt), "MMM d, yyyy") },
                { 
                  header: "Action", 
                  cell: (p) => (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/prompts/${p.id}`}>Review</Link>
                    </Button>
                  ),
                  className: "text-right"
                },
              ]}
              emptyState={
                <EmptyState
                  icon={<CheckSquare className="w-6 h-6" />}
                  title="All caught up!"
                  description="There are no prompts currently awaiting review."
                />
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
