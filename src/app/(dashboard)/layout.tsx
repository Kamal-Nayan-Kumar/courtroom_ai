"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StartCaseModal } from "@/components/dashboard/StartCaseModal";
import { CommandMenu } from "@/components/dashboard/CommandMenu";
import { StatuteMapperDialog } from "@/components/dashboard/StatuteMapperDialog";
import { WitnessPrepModal } from "@/components/dashboard/WitnessPrepModal";
import { PrecedentViewerModal } from "@/components/dashboard/PrecedentViewerModal";
import { CheckCircle2 } from "lucide-react";

function NotificationToast() {
  const { notification } = useDashboard();
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-medium shadow-2xl border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
      <span>{notification}</span>
    </div>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCourtroom = pathname?.includes("/courtroom");

  if (isCourtroom) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#F7F7F5] flex flex-col">
        {children}
        <NotificationToast />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-[#FAFAFA]">
        {/* Navigation Sidebar */}
        <AppSidebar />

        {/* Inset Main Workspace */}
        <SidebarInset className="bg-[#FAFAFA] flex flex-col flex-1 overflow-x-hidden min-w-0">
          {/* Top Sticky Header */}
          <DashboardHeader />

          {/* Main Page Canvas */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>

        {/* Global Interactive Modals */}
        <StartCaseModal />
        <CommandMenu />
        <StatuteMapperDialog />
        <WitnessPrepModal />
        <PrecedentViewerModal />
        <NotificationToast />
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-[#FAFAFA]" />}>
        <DashboardShell>{children}</DashboardShell>
      </React.Suspense>
    </DashboardProvider>
  );
}
