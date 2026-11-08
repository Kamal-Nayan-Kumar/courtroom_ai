"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Library,
  FlaskConical,
  Users,
  Gavel,
  Plus,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDashboard } from "@/context/DashboardContext";
import { ADVOCATE_PROFILE } from "@/data/dashboardData";
import { authClient } from "@/lib/auth/client";

export function AppSidebar() {
  const { openNewCaseModal, showNotification } = useDashboard();
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [firstCaseId, setFirstCaseId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cases", { cache: "no-store" });
        const json = (await res.json()) as Array<{ id: string }>;
        if (!cancelled && Array.isArray(json) && json[0]?.id) setFirstCaseId(json[0].id);
      } catch {
        // leave links pointed at dashboard
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const prepHref = firstCaseId ? `/case/${encodeURIComponent(firstCaseId)}/prep` : "/dashboard";
  const courtroomHref = firstCaseId ? `/case/${encodeURIComponent(firstCaseId)}/courtroom` : "/dashboard";
  const witnessHref = firstCaseId ? `/case/${encodeURIComponent(firstCaseId)}/prep` : "/dashboard";

  const workspaceNav = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "My Cases",
      icon: Briefcase,
      href: "/dashboard",
    },
    {
      title: "Public Cases",
      icon: Library,
      href: "/dashboard",
    },
    {
      title: "Prep Lab",
      icon: FlaskConical,
      href: prepHref,
    },
    {
      title: "Witness Lab",
      icon: Users,
      href: witnessHref,
    },
    {
      title: "Courtroom",
      icon: Gavel,
      href: courtroomHref,
    },
  ];

  const signOut = async () => {
    try {
      // @ts-ignore - neon auth client exposes signOut in newer versions
      await authClient.signOut?.();
    } catch {
      // fall through to redirect
    }
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-zinc-200/80 bg-[#FCFCFC]">
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2 border-b border-zinc-200/70">
        <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center">
            <div className="size-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-xs bg-black">
              <Image
                src="/logo_icon.png"
                alt="Courtroom AI Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col truncate leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-sm tracking-tight text-zinc-950">Courtroom AI</span>
              <span className="text-[11px] font-medium text-zinc-500">Chamber Suite</span>
            </div>
          </Link>
        </div>

        <div className="mt-2 group-data-[collapsible=icon]:hidden">
          <button
            type="button"
            onClick={() => openNewCaseModal()}
            className="w-full flex items-center justify-center gap-1 bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium shadow-xs h-8 rounded-md transition-colors px-3"
          >
            <Plus className="size-3.5 mr-1" />
            New Trial Session
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase px-2 mb-1">
            Chamber Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceNav.map((item) => {
                const isActive = activeItem === item.title;
                const IconComponent = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 text-xs font-medium transition-colors ${
                        isActive
                          ? "!bg-zinc-950 !text-white hover:!bg-zinc-900 hover:!text-white font-semibold shadow-2xs"
                          : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                      }`}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setActiveItem(item.title)}
                        className="w-full flex items-center gap-2.5 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                      >
                        <IconComponent className={`size-4 shrink-0 ${isActive ? "!text-white" : "text-zinc-500"}`} />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-zinc-200/70">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  title="Adv. Kamal Nayan"
                  className="w-full flex items-center justify-between p-1.5 rounded-lg border border-zinc-200/80 bg-white hover:bg-zinc-50 transition-colors text-left group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <Avatar className="size-7 border border-zinc-200 shrink-0">
                      <AvatarFallback className="bg-zinc-950 text-white text-[11px] font-semibold">
                        KN
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
                      <span className="text-xs font-semibold text-zinc-900 truncate">
                        {ADVOCATE_PROFILE.name}
                      </span>
                      <span className="text-[10px] text-zinc-500 truncate font-mono">
                        {ADVOCATE_PROFILE.barCouncilNumber}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="size-3.5 text-zinc-400 group-data-[collapsible=icon]:hidden shrink-0 ml-1" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="end"
                className="w-56 p-2 shadow-lg border-zinc-200"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-zinc-950">{ADVOCATE_PROFILE.name}</p>
                    <p className="text-xs text-zinc-500 font-sans">{ADVOCATE_PROFILE.designation}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()} className="text-xs text-rose-600 focus:text-rose-600 cursor-pointer">
                  <LogOut className="size-3.5 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
  );
}
