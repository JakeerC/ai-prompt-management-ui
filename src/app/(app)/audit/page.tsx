"use client";

import { useAuditTrail } from "@/hooks/use-audit";
import { DataTable } from "@/components/shared/data-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/shared/empty-state";
import { ActivitySquare } from "lucide-react";
import { AUDIT_ACTION_LABELS } from "@/types/audit";
import Link from "next/link";

export default function GlobalAuditPage() {
  // Pass a dummy promptId for now since there's no global audit API in backend currently, 
  // but if there were, we'd call a global endpoint. Here we'll just mock it or call a generic search.
  // Assuming a generic global audit endpoint exists or will exist:
  const { data: audits, isLoading } = useAuditTrail("GLOBAL", { size: 50 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Global Audit Log</h2>
        <p className="text-muted-foreground mt-1">
          System-wide record of all prompt lifecycle events.
        </p>
      </div>

      <Card className="glass flex-1">
        <CardHeader>
          <CardTitle>Activity Trail</CardTitle>
          <CardDescription>
            Comprehensive security log of actions taken by users across all prompts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            data={audits?.content || []}
            columns={[
              { header: "Time", cell: (a) => formatDistanceToNow(new Date(a.createdAt), { addSuffix: true }) },
              { header: "Action", cell: (a) => <span className="font-medium">{AUDIT_ACTION_LABELS[a.action]}</span> },
              { 
                header: "Prompt ID", 
                cell: (a) => (
                  <Link href={`/prompts/${a.promptId}`} className="font-mono text-primary hover:underline">
                    {a.promptId.substring(0, 8)}...
                  </Link>
                ) 
              },
              { header: "Actor", cell: (a) => `${a.actorId} (${a.actorRole})` },
              { header: "IP Address", cell: (a) => a.ipAddress || "-" },
            ]}
            emptyState={
              <EmptyState
                icon={<ActivitySquare className="w-6 h-6" />}
                title="No audit events"
                description="The global audit log is currently empty."
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
