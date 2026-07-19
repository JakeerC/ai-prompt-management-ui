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
import { CheckSquare } from "lucide-react";

export default function ReviewQueuePage() {
  const { data: prompts, isLoading } = useSearchPrompts({
    status: "IN_REVIEW",
    size: 50,
    sortBy: "updatedAt",
    sortDir: "asc",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground mt-1">
          Prompts pending your approval based on your reviewer role.
        </p>
      </div>

      <Card className="glass flex-1">
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
          <CardDescription>
            These prompts have been submitted for review and are awaiting approval to be published.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            data={prompts?.content || []}
            columns={[
              { header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
              { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
              { header: "Impact", cell: (p) => <ImpactBadge impact={p.businessImpact} /> },
              { header: "Author", accessorKey: "createdBy" },
              { header: "Submitted", cell: (p) => format(new Date(p.updatedAt), "MMM d, yyyy h:mm a") },
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
  );
}
