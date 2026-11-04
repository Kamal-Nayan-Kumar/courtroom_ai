"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_ITEMS } from "../data/courtroomData";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-zinc-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono-code font-medium mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Everything You Need to Know
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            Clarifications on our Indian legal knowledge engine, multi-agent arbitration,
            privacy guarantees, and student access.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="rounded-xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-zinc-50/60"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-zinc-900 pr-4">
                    {item.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-zinc-900 text-white" : "text-zinc-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 font-sans">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Small bottom note */}
        <div className="mt-8 text-center text-xs text-zinc-500">
          Have a bespoke moot competition or law faculty inquiry?{" "}
          <a href="#cta" className="font-semibold text-zinc-900 underline hover:text-blue-900">
            Reach out to our Indian Academic Team
          </a>
        </div>
      </div>
    </section>
  );
}
