"use client";

import { useState } from "react";
import { useSearchPrompts } from "@/hooks/use-prompts";
import { PromptCard } from "@/components/shared/prompt-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, FilterX } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { RequireRole } from "@/components/shared/require-role";

export default function PromptsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useSearchPrompts({
    name: debouncedSearch || undefined,
    size: 20,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Prompt Library</h2>
          <p className="text-muted-foreground mt-1">
            Browse, search, and manage all your AI prompts.
          </p>
        </div>
        <RequireRole role="AUTHOR">
          <Button asChild className="shrink-0 gap-2">
            <Link href="/prompts/new">
              <Plus className="w-4 h-4" />
              Create Prompt
            </Link>
          </Button>
        </RequireRole>
      </div>

      <div className="flex items-center gap-4 bg-background/50 p-1 backdrop-blur-sm rounded-lg sticky top-0 z-10 py-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 glass bg-background/50"
          />
        </div>
        <Button variant="outline" className="gap-2 glass">
          <FilterX className="w-4 h-4" />
          Filters
        </Button>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data?.content && data.content.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.content.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No prompts found"
            description={
              searchTerm
                ? `No prompts match your search for "${searchTerm}".`
                : "Your prompt library is empty."
            }
            action={
              <RequireRole role="AUTHOR">
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/prompts/new">Create your first prompt</Link>
                </Button>
              </RequireRole>
            }
          />
        )}
      </div>
    </div>
  );
}
