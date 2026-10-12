"use client";
import * as React from "react";

import {
  HomeIcon,
  TagsIcon,
  List,
  Share2,
} from "lucide-react";

import {
  SiFacebook,
  SiInstagram,
  SiYoutube,
  SiX,
  SiGithub,
  SiTiktok,
  SiTelegram,
  SiPinterest,
} from "react-icons/si";

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
import Link from "next/link";
import { usePathname } from "next/navigation";

import Image from "next/image";
import { Site } from "@/app/(public)/layout";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "",
      url: "/home",
      items: [
        {
          title: "Home",
          url: "home",
          isActive: true,
          icon: HomeIcon,
        },
        {
          title: "JAV",
          url: "category/jav",
          icon: TagsIcon,
        },
        {
          title: "JAV Cosplay",
          url: "category/jav-cosplay",
          icon: TagsIcon,
        },
        {
          title: "Local Pride",
          url: "category/local-pride",
          icon: TagsIcon,
        },
        {
          title: "Genre List",
          url: "genres",
          icon: List,
        },
      ],
    },
  ],
};

const platformIcons = {
  facebook: SiFacebook,
  instagram: SiInstagram,
  youtube: SiYoutube,
  twitter: SiX,
  x: SiX,
  github: SiGithub,
  tiktok: SiTiktok,
  telegram: SiTelegram,
  pinterest: SiPinterest,
} as const;

export function AppSidebar({
  site,
  ...props
}: { site: Site } & React.ComponentProps<typeof Sidebar>) {

  const pathname = usePathname();
  const currentPath = pathname.replace(/\/+$/, "") || "/";
  const socialLinks = site.socialLinks ?? [];
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex gap-4">
          <div className="flex  aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Image
              src={site.logo ?? ""}
              className="w-20 h-20"
              height={100}
              width={100}
              alt={site.title}
            />
          </div>
          <div className="grid items-center text-left text-sm leading-tight">
            <span className="truncate font-medium">{site.title}</span>
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
                        item.url === "home"
                          ? currentPath === "/"
                          : currentPath === `/${item.url}` ||
                            currentPath.startsWith(`/${item.url}/`)
                      }
                      render={
                        <Link
                          href={item.url === "home" ? "/" : `/${item.url}`}
                        />
                      }
                    >
                      <item.icon />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
        {socialLinks.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Social Links</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {socialLinks.map((social) => {
                  const platform =
                    social.platform.toLowerCase() as keyof typeof platformIcons;

                  const Icon = platformIcons[platform] ?? Share2;

                  return (
                    <SidebarMenuItem key={social.id}>
                      <SidebarMenuButton
                        tooltip={social.name}
                        render={
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <Icon />
                        <span className="truncate">{social.name}</span>
            
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
