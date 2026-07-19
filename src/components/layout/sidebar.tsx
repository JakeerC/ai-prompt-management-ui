"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Library,
  CheckSquare,
  FolderTree,
  ActivitySquare,
  Settings,
  Users
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    minRole: "VIEWER",
  },
  {
    title: "Prompt Library",
    url: "/prompts",
    icon: Library,
    minRole: "VIEWER",
  },
  {
    title: "Review Queue",
    url: "/review",
    icon: CheckSquare,
    minRole: "REVIEWER",
  },
  {
    title: "Categories",
    url: "/categories",
    icon: FolderTree,
    minRole: "VIEWER",
  },
  {
    title: "Global Audit",
    url: "/audit",
    icon: ActivitySquare,
    minRole: "ADMIN",
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
    minRole: "ADMIN",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { hasRole } = useAuth();

  return (
    <Sidebar variant="inset" className="border-r glass">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/50">
        <div className="flex items-center gap-2 px-4 w-full">
          <Logo className="w-8 h-8 shadow-lg" />
          <span className="font-bold tracking-wide">PM Platform</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (!hasRole(item.minRole as import("@/types/auth").UserRole)) return null;
                
                const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                      tooltip={item.title}
                    >
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href="/settings" />} isActive={pathname.startsWith("/settings")}>
                <Settings className="w-4 h-4" />
                <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
