"use client";

import { useSearchPrompts } from "@/hooks/use-prompts";
import { KPICard } from "@/components/shared/kpi-card";
import { PromptCard } from "@/components/shared/prompt-card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { useAuth } from "@/contexts/auth-context";
import { TerminalSquare, Clock, CheckCircle2, Activity } from "lucide-react";

export default function Dashboard() {
  useAuth();

  // Fetch recent prompts
  const { data: recentPrompts, isLoading: loadingRecent } = useSearchPrompts({
    size: 5,
    sortBy: "updatedAt",
    sortDir: "desc",
  });

  // Fetch metrics (simulated with basic queries for now)
  const { data: totalPromptsData } = useSearchPrompts({ size: 1 });
  const { data: pendingReviewsData } = useSearchPrompts({ status: "IN_REVIEW", size: 1 });
  const { data: publishedData } = useSearchPrompts({ status: "PUBLISHED", size: 1 });

  const totalPrompts = totalPromptsData?.totalElements || 0;
  const pendingReviews = pendingReviewsData?.totalElements || 0;
  const publishedPrompts = publishedData?.totalElements || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of your prompt engineering platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Prompts"
          value={totalPrompts}
          icon={<TerminalSquare className="w-4 h-4" />}
          trend={{ value: 12, label: "from last month", positive: true }}
        />
        <KPICard
          title="Pending Review"
          value={pendingReviews}
          icon={<Clock className="w-4 h-4" />}
          trend={{ value: -2, label: "from last week", positive: true }}
        />
        <KPICard
          title="Published Prompts"
          value={publishedPrompts}
          icon={<CheckCircle2 className="w-4 h-4" />}
          description="Active in production"
        />
        <KPICard
          title="Usage Events Today"
          value="1,247" // Hardcoded for now until usage API is fully integrated
          icon={<Activity className="w-4 h-4" />}
          trend={{ value: 5, label: "vs yesterday", positive: true }}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Recent Prompts</h3>
          </div>
          <div className="grid gap-4">
            {loadingRecent
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
              : recentPrompts?.content.slice(0, 3).map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
          </div>
        </div>

        {/* Placeholder for Usage Chart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Usage Overview</h3>
          </div>
          <div className="h-[400px] rounded-xl border glass flex items-center justify-center bg-muted/10">
            <p className="text-muted-foreground">Usage charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
