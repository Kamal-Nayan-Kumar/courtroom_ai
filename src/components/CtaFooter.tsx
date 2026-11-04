"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function CtaFooter() {
  const footerLinks = {
    product: [
      { label: "Courtroom Simulator", href: "#simulation" },
      { label: "Witness Prep Lab", href: "#workflow" },
      { label: "Public Case Library", href: "#dashboard" },
      { label: "Chamber Analytics", href: "#dashboard" },
      { label: "Bench Scoring API", href: "#agents" },
    ],
    modules: [
      { label: "BNS 2023 Sandbox", href: "#workflow" },
      { label: "BNSS Criminal Procedure", href: "#simulation" },
      { label: "BSA Digital Evidence 63(4)", href: "#simulation" },
      { label: "Supreme Court Precedents", href: "#workflow" },
      { label: "Legacy IPC/CrPC Mapping", href: "#simulation" },
    ],
    resources: [
      { label: "Moot Court Society Guide", href: "#" },
      { label: "BNS Transition Handbook", href: "#" },
      { label: "Trial Video Walkthroughs", href: "#" },
      { label: "Academic Faculty Portal", href: "#" },
      { label: "Community Discord & Forum", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy (DPDPA 2023)", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Bar Council Compliance", href: "#" },
      { label: "Data Security Architecture", href: "#" },
      { label: "AI Safety & Ethics Charter", href: "#" },
    ],
  };

  return (
    <footer id="cta" className="bg-[#FAFAFA] pt-16 pb-12 border-t border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Big CTA Card */}
        <div className="relative rounded-3xl border border-zinc-300/80 bg-white p-8 sm:p-12 md:p-16 shadow-lg overflow-hidden text-center mb-16">
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-100/40 blur-3xl pointer-events-none -z-10" />

          <div className="relative max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono-code font-medium mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Free Student &amp; Advocate Access Open</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 leading-tight">
              The Court is Now in Session.{" "}
              <span className="font-editorial italic font-normal text-blue-950 block sm:inline">
                Ready to Present Your Case?
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-lg text-zinc-600 leading-relaxed">
              Join thousands of Indian law students, moot teams, and chamber advocates who test
              their strategy against proactive AI agents before facing the real bench.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                href="#simulation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>Start Practicing Free</span>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
              </a>
              <a
                href="#workflow"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-800 font-medium text-sm transition-colors"
              >
                <span>Upload Case Memorial</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pt-8 pb-12 border-b border-zinc-200 text-xs">
          {/* Brand Info (Span 2 on mobile, 1 on desktop) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shadow-xs bg-black">
                <Image
                  src="/logo_icon.png"
                  alt="Courtroom AI"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-zinc-950">
                Courtroom AI
              </span>
            </div>
            <p className="text-zinc-600 leading-relaxed text-[11.5px]">
              Multi-agent Indian courtroom simulator for law students, moot court societies,
              and practicing trial advocates.
            </p>
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono-code text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
              <span>Courtroom AI Platform · v1.0</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-[11px] mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              {footerLinks.product.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Indian Legal Modules */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-[11px] mb-3">
              Indian Legal Modules
            </h4>
            <ul className="space-y-2">
              {footerLinks.modules.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-[11px] mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="font-bold text-zinc-950 uppercase tracking-wider text-[11px] mb-3">
              Legal &amp; Privacy
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-zinc-600 hover:text-zinc-950 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-3">
          <p>© 2026 Courtroom AI. Built for the Indian Legal Ecosystem.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with devotion for Indian law students &amp; advocates</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
