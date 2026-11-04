"use client";

import React, { useState } from "react";
import { Scale, ArrowRight, Menu, X, ShieldCheck } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Simulation", href: "#simulation" },
    { label: "Multi-Agent Engine", href: "#agents" },
    { label: "Case Prep", href: "#workflow" },
    { label: "Dashboard", href: "#dashboard" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-[#FAFAFA]/90 backdrop-blur-md transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Subtle Badge */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Scale className="w-4 h-4 text-amber-400 stroke-[2.2]" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-lg tracking-tight text-zinc-950">
                Courtroom AI
              </span>
              <span className="text-[11px] font-medium text-zinc-500 hidden sm:inline">
                (Adalat AI)
              </span>
            </div>
          </a>

          {/* Indian Legal System Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200/90 text-[11px] text-zinc-700 font-mono-code font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>IN · BNS / BNSS Ready</span>
          </div>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium text-zinc-600">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-zinc-950 py-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href="#dashboard"
            className="text-[13px] font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5 rounded-md hover:bg-zinc-100/80 transition-colors"
          >
            Sign In
          </a>
          <a
            href="#simulation"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white bg-zinc-950 hover:bg-zinc-800 px-3.5 py-1.5 rounded-md shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
          >
            <span>Enter Courtroom</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-300" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="#simulation"
            className="text-xs font-medium text-white bg-zinc-950 px-2.5 py-1 rounded-md"
          >
            Enter
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-600 hover:text-zinc-950 rounded-md hover:bg-zinc-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-5 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono-code text-zinc-700">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
            <span>Updated with Bharatiya Nyaya Sanhita 2023</span>
          </div>
          <div className="flex flex-col space-y-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-700 hover:text-zinc-950 py-1.5 border-b border-zinc-100"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-zinc-800 border border-zinc-200 rounded-md hover:bg-zinc-50"
            >
              Sign In
            </a>
            <a
              href="#simulation"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-sm font-medium text-white bg-zinc-950 rounded-md"
            >
              Enter Courtroom -&gt;
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
