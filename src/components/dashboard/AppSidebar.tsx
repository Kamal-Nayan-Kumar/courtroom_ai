"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Library,
  Users,
  Scale,
  Gavel,
  Settings,
  HelpCircle,
  Plus,
  Sparkles,
  ChevronDown,
  User,
  Key,
  Sliders,
  CreditCard,
  LogOut,
  ExternalLink,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/context/DashboardContext";
import { ADVOCATE_PROFILE } from "@/data/dashboardData";

export function AppSidebar() {
  const { openNewCaseModal, setIsStatuteMapperOpen, setIsWitnessModalOpen, showNotification } = useDashboard();
  const { state } = useSidebar();
  const [activeItem, setActiveItem] = useState("Dashboard");

  const workspaceNav = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      badge: null,
      action: () => setActiveItem("Dashboard"),
    },
    {
      title: "Active Cases",
      icon: Briefcase,
      href: "/dashboard#cases-table",
      badge: null,
      action: () => {
        setActiveItem("Active Cases");
        const el = document.getElementById("cases-table");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      title: "Public Case Docket",
      icon: Library,
      href: "/dashboard#library-grid",
      badge: null,
      action: () => {
        setActiveItem("Public Case Docket");
        const el = document.getElementById("library-grid");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      title: "Witness Prep Lab",
      icon: Users,
      href: "/case/402/prep",
      badge: null,
      action: () => {
        setActiveItem("Witness Prep Lab");
      },
    },
    {
      title: "Bare Acts & Precedents",
      icon: Scale,
      href: "#",
      badge: null,
      action: () => {
        setActiveItem("Bare Acts & Precedents");
        setIsStatuteMapperOpen(true);
      },
    },
    {
      title: "Live Courtroom",
      icon: Gavel,
      href: "/case/402/courtroom",
      badge: null,
      action: () => {
        setActiveItem("Live Courtroom");
      },
    },
  ];

  const recentDockets = [
    {
      id: "case-402",
      title: "State vs. R. Sharma",
      statute: "BNS 103",
      statusColor: "bg-emerald-500",
      statusText: "Cross-Exam (PW-1)",
    },
    {
      id: "case-184",
      title: "Mehta Cyber Fraud",
      statute: "BSA 63",
      statusColor: "bg-amber-500",
      statusText: "Pre-Trial Brief",
    },
    {
      id: "case-04",
      title: "Union of India Moot #4",
      statute: "Art 21",
      statusColor: "bg-blue-500",
      statusText: "Final Arguments",
    },
  ];

  return (
    <Sidebar collapsible="icon" variant="inset" className="border-r border-zinc-200/80 bg-[#FCFCFC]">
      {/* Sidebar Header */}
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

        {/* Quick CTA inside header */}
        <div className="mt-2 group-data-[collapsible=icon]:hidden">
          <Button
            onClick={() => openNewCaseModal()}
            size="sm"
            className="w-full bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium justify-center shadow-xs h-8"
          >
            <Plus className="size-3.5 mr-1" />
            New Trial Session
          </Button>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-3">
        {/* Group 1: Chamber Workspace */}
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
                      {item.href.startsWith("/") ? (
                        <Link
                          href={item.href}
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                        >
                          <IconComponent className={`size-4 shrink-0 ${isActive ? "!text-white" : "text-zinc-500"}`} />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                        >
                          <IconComponent className={`size-4 shrink-0 ${isActive ? "!text-white" : "text-zinc-500"}`} />
                          <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </button>
                      )}
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-white/20 text-white font-bold"
                            : "bg-zinc-100 text-zinc-700 border border-zinc-200/80 font-medium"
                        }`}
                      >
                        {item.badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Group 2: Recent Active Dockets (hidden when collapsed to icon) */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-4">
          <SidebarGroupLabel className="text-[11px] font-semibold text-zinc-400 tracking-wider uppercase px-2 mb-1">
            Recent Active Dockets
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentDockets.map((docket) => (
                <SidebarMenuItem key={docket.id}>
                  <SidebarMenuButton
                    asChild
                    size="sm"
                    className="h-8 text-xs text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  >
                    <Link
                      href={docket.id === "case-402" ? "/case/402/prep" : "/dashboard#cases-table"}
                      className="w-full flex items-center justify-between px-2"
                      onClick={() => {
                        if (docket.id !== "case-402") {
                          const el = document.getElementById("cases-table");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`size-1.5 rounded-full shrink-0 ${docket.statusColor}`} />
                        <span className="truncate font-medium">{docket.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-1">
                        {docket.statute}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-2 border-t border-zinc-200/70">
        <SidebarMenu>
          {/* Quick Settings & Help */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="sm"
              tooltip="Settings"
              className="text-xs text-zinc-600 hover:text-zinc-950"
            >
              <button
                type="button"
                onClick={() => showNotification("Chamber Settings: Configured for High Court & Sessions Coram.")}
                className="flex items-center gap-2 px-2"
              >
                <Settings className="size-4 text-zinc-500" />
                <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="sm"
              tooltip="Help & Court Rules"
              className="text-xs text-zinc-600 hover:text-zinc-950"
            >
              <button
                type="button"
                onClick={() => showNotification("Court Rules: BNS 2023, BNSS 2023, BSA 2023 procedures active.")}
                className="flex items-center gap-2 px-2"
              >
                <HelpCircle className="size-4 text-zinc-500" />
                <span className="group-data-[collapsible=icon]:hidden">Help & Court Rules</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem className="mt-1">
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
                className="w-60 p-2 shadow-lg border-zinc-200"
              >
                <DropdownMenuLabel className="p-2 font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold text-zinc-950">{ADVOCATE_PROFILE.name}</p>
                    <p className="text-xs text-zinc-500 font-sans">{ADVOCATE_PROFILE.designation}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="outline" className="text-xs bg-amber-50 text-amber-800 border-amber-200 font-sans font-medium">
                        {ADVOCATE_PROFILE.tier}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-200 font-sans font-medium">
                        Verified Bar
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => showNotification("Advocate Profile: Kamal Nayan, Bar ID: KAR/1084/2026.")}
                    className="text-xs cursor-pointer"
                  >
                    <User className="size-3.5 mr-2 text-zinc-500" />
                    Advocate Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => showNotification("API Keys: Groq Llama-3.3 70B & OpenRouter active.")}
                    className="text-xs cursor-pointer"
                  >
                    <Key className="size-3.5 mr-2 text-zinc-500" />
                    API & LLM Keys (Groq/OpenRouter)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => showNotification("Default Judge Temperament: Strict Proceduralist.")}
                    className="text-xs cursor-pointer"
                  >
                    <Sliders className="size-3.5 mr-2 text-zinc-500" />
                    Default Judge Temperament
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => showNotification("Billing: Pro Moot Tier active (unlimited trials).")}
                    className="text-xs cursor-pointer"
                  >
                    <CreditCard className="size-3.5 mr-2 text-zinc-500" />
                    Billing & Subscription
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => showNotification("Signed out of session.")}
                  className="text-xs text-rose-600 focus:text-rose-600 cursor-pointer"
                >
                  <LogOut className="size-3.5 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for drag/hover toggle */}
      <SidebarRail />
    </Sidebar>
  );
}
