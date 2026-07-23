"use client";

import { useCategories } from "@/hooks/use-categories";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderTree, Plus } from "lucide-react";
import { RequireRole } from "@/components/shared/require-role";
import { Badge } from "@/components/ui/badge";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground mt-1">
            Manage the taxonomy of your prompt library.
          </p>
        </div>
        <RequireRole role="ADMIN">
          <Button className="shrink-0 gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </RequireRole>
      </div>

      <Card className="glass flex-1 min-w-0">
        <CardHeader>
          <CardTitle>Library Categories</CardTitle>
          <CardDescription>
            Hierarchical organization for prompt templates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            loading={isLoading}
            data={categories || []}
            columns={[
              { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
              { header: "Slug", cell: (c) => <Badge variant="outline" className="font-mono bg-background/50">{c.slug}</Badge> },
              { header: "Description", accessorKey: "description" },
              { header: "Parent ID", cell: (c) => c.parentId || "-" },
            ]}
            emptyState={
              <EmptyState
                icon={<FolderTree className="w-6 h-6" />}
                title="No categories found"
                description="Create a category to organize your prompts."
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
