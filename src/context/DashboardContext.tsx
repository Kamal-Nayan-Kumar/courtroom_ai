"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ActiveDocketItem, PublicPracticeCase } from "../types/dashboard";
import { ACTIVE_DOCKET } from "../data/dashboardData";

interface DashboardContextType {
  isNewCaseOpen: boolean;
  setIsNewCaseOpen: (open: boolean) => void;
  preselectedPracticeCase: PublicPracticeCase | null;
  openNewCaseModal: (practiceCase?: PublicPracticeCase) => void;

  isCommandMenuOpen: boolean;
  setIsCommandMenuOpen: (open: boolean) => void;

  isStatuteMapperOpen: boolean;
  setIsStatuteMapperOpen: (open: boolean) => void;

  isWitnessModalOpen: boolean;
  setIsWitnessModalOpen: (open: boolean) => void;
  isBriefModalOpen: boolean;
  setIsBriefModalOpen: (open: boolean) => void;

  activeDocket: ActiveDocketItem[];
  selectedCase: ActiveDocketItem | null;
  setSelectedCase: (item: ActiveDocketItem | null) => void;

  notification: string | null;
  showNotification: (msg: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [preselectedPracticeCase, setPreselectedPracticeCase] = useState<PublicPracticeCase | null>(null);
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [isStatuteMapperOpen, setIsStatuteMapperOpen] = useState(false);
  const [isWitnessModalOpen, setIsWitnessModalOpen] = useState(false);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [activeDocket, setActiveDocket] = useState<ActiveDocketItem[]>(ACTIVE_DOCKET);
  const [selectedCase, setSelectedCase] = useState<ActiveDocketItem | null>(ACTIVE_DOCKET[0] || null);
  const [notification, setNotification] = useState<string | null>(null);

  const openNewCaseModal = (practiceCase?: PublicPracticeCase) => {
    if (practiceCase) {
      setPreselectedPracticeCase(practiceCase);
    } else {
      setPreselectedPracticeCase(null);
    }
    setIsNewCaseOpen(true);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsCommandMenuOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isNewCaseOpen,
        setIsNewCaseOpen,
        preselectedPracticeCase,
        openNewCaseModal,
        isCommandMenuOpen,
        setIsCommandMenuOpen,
        isStatuteMapperOpen,
        setIsStatuteMapperOpen,
        isWitnessModalOpen,
        setIsWitnessModalOpen,
        isBriefModalOpen,
        setIsBriefModalOpen,
        activeDocket,
        selectedCase,
        setSelectedCase,
        notification,
        showNotification,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
