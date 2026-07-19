"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <TopBar />
        <main className="flex-1 flex flex-col min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 overflow-x-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none opacity-50 dark:opacity-20" />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
