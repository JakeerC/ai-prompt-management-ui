import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./status-badge";
import { ImpactBadge } from "./impact-badge";
import { formatDistanceToNow } from "date-fns";
import type { Prompt } from "@/types/prompt";
import { TerminalSquare, User } from "lucide-react";

interface PromptCardProps {
  prompt: Prompt;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Link href={`/prompts/${prompt.id}`} className="block h-full outline-none focus-visible:ring-2 ring-primary rounded-xl">
      <Card className="h-full flex flex-col hover:border-primary/50 transition-colors glass glow-card overflow-hidden">
        <CardHeader className="pb-3 flex-row items-start justify-between space-y-0 gap-4">
          <div className="space-y-1 overflow-hidden">
            <CardTitle className="truncate font-semibold text-lg flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-primary" />
              {prompt.name}
            </CardTitle>
            {prompt.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {prompt.description}
              </p>
            )}
          </div>
          <StatusBadge status={prompt.status} className="shrink-0" />
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <div className="flex flex-wrap gap-2">
            <ImpactBadge impact={prompt.businessImpact} />
            {prompt.category && (
              <Badge variant="secondary" className="font-normal text-xs">
                {prompt.category.name}
              </Badge>
            )}
            {prompt.tags?.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="font-normal text-xs text-muted-foreground">
                #{tag.name}
              </Badge>
            ))}
            {(prompt.tags?.length || 0) > 3 && (
              <Badge variant="outline" className="font-normal text-xs text-muted-foreground">
                +{(prompt.tags?.length || 0) - 3} more
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t border-border/50 text-xs text-muted-foreground flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{prompt.ownerId}</span>
          </div>
          <span className="shrink-0">
            {formatDistanceToNow(new Date(prompt.updatedAt), { addSuffix: true })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
