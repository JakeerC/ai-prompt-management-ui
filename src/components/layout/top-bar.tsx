"use client";

import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  const { role } = useAuth();
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold gradient-text tracking-tight hidden sm:block">
          AI Prompt Management
        </h1>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
        </Button>
        <ThemeToggle />
        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
        <UserMenu />
      </div>
    </header>
  );
}
