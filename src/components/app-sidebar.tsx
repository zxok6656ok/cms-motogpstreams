"use client";
import * as React from "react";

import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  LogOutIcon,
  User,
  Files,
  Globe,
  Image,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Command } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Site } from "@/app/(admin)/panel/layout";
import { logout } from "@/app/(auth)/panel/login/action";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "CMS PANEL",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "dashboard",
          isActive: true,
          icon: LayoutDashboard,
        },
        {
          title: "Posts",
          url: "posts",
          icon: FileText,
        },
        {
          title: "About",
          url: "about",
          icon: Files,
        },
        {
          title: "Disclaimer",
          url: "disclaimer",
          icon: FileText,
        },
        {
          title: "Terms",
          url: "terms",
          icon: FileText,
        },
        {
          title: "Privacy Policy",
          url: "privacy",
          icon: Globe,
        },
        {
          title: "Users",
          url: "users",
          icon: Users,
        },
        {
          title: "Profile",
          url: "profile",
          icon: User,
        },
        {
          title: "Hero",
          url: "hero",
          icon: Image,
        },
        {
          title: "Settings",
          url: "settings",
          icon: Settings,
        },
      ],
    },
  ],
};
export function AppSidebar({
  site,
  ...props
}: { site: Site } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-4">
          <div className="flex  aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{site.title}</span>
            <span className="truncate text-xs">CMS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={
                        item.url === "dashboard"
                          ? currentPath === "/panel" ||
                            currentPath === "/panel/dashboard" ||
                            currentPath.startsWith("/panel/dashboard/")
                          : currentPath === `/panel/${item.url}` ||
                            currentPath.startsWith(`/panel/${item.url}/`)
                      }
                      render={<Link href={`/panel/${item.url}`} />}
                    >
                      <item.icon />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <form action={logout}>
                    <SidebarMenuButton type="submit">
                      <LogOutIcon />
                      Logout
                    </SidebarMenuButton>
                  </form>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
