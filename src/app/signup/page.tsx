"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  ArrowRight,
  Shield,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Gavel,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Adv. Kamal Nayan");
  const [barId, setBarId] = useState("KAR/1084/2026");
  const [email, setEmail] = useState("kamal.nayan@chamber.law");
  const [password, setPassword] = useState("••••••••••••");
  const [jurisdiction, setJurisdiction] = useState("trial");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-white text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
      {/* LEFT COLUMN: Advocate Registration Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Scale className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-zinc-950">
                Courtroom AI
              </span>
              <span className="text-[10px] font-mono text-zinc-500 font-medium">
                BNS / BNSS / BSA
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Already have an account? Sign in</span>
          </Link>
        </div>

        {/* Central Form Container */}
        <div className="my-auto py-6 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant="outline"
              className="w-fit text-[10.5px] font-mono bg-zinc-50 text-zinc-800 border-zinc-200"
            >
              Indian Bar Verification & Trial Setup
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tracking-tight">
              Create Advocate Account
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Join over 4,200 advocates and mooters practicing trials with autonomous AI benches.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-zinc-900">
                  Full Name & Title
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Adv. Kamal Nayan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-9 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="barId" className="text-xs font-semibold text-zinc-900">
                  Bar Council ID / Student Reg
                </Label>
                <Input
                  id="barId"
                  type="text"
                  placeholder="e.g. KAR/1084/2026 or NLU/2026"
                  value={barId}
                  onChange={(e) => setBarId(e.target.value)}
                  required
                  className="h-9 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950 font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-900">
                Chamber or Institutional Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="counsel@highcourtbar.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-zinc-900">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Create secure chamber password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jurisdiction" className="text-xs font-semibold text-zinc-900">
                Primary Practice / Simulation Focus
              </Label>
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger id="jurisdiction" className="h-9 text-xs bg-zinc-50/60 border-zinc-200">
                  <SelectValue placeholder="Select primary practice area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-xs">Chamber Jurisdictions</SelectLabel>
                    <SelectItem value="trial">
                      Sessions Court & Trial Advocacy (Witness Cross-Exam & BNS/BSA)
                    </SelectItem>
                    <SelectItem value="appellate">
                      High Court Appellate Bench & Bail Hearings (BNSS Sec 480/483)
                    </SelectItem>
                    <SelectItem value="moot">
                      National Law School & Collegiate Moot Court Competitions
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(v) => setTermsAccepted(!!v)}
                className="mt-0.5"
              />
              <Label
                htmlFor="terms"
                className="text-[11.5px] text-zinc-600 font-normal leading-relaxed cursor-pointer select-none"
              >
                I confirm I am an enrolled advocate, law pupil, or collegiate researcher practicing under Indian statutory procedures.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !termsAccepted}
              className="mt-2 h-10 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm"
            >
              <span>{isSubmitting ? "Provisioning Chamber Dossier..." : "Register Chamber Account"}</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Toggle to Sign In */}
          <div className="text-center text-xs text-zinc-600">
            <span>Already have an active chamber profile? </span>
            <Link
              href="/login"
              className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Sign in</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Bar Council of India Verified Rules</span>
          <span>Zero Hallucination RAG</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Editorial Judicial Visual & Social Proof Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-zinc-950 text-white relative overflow-hidden border-l border-zinc-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[11px] font-mono text-zinc-300 border-zinc-800 bg-zinc-900/80 px-3 py-1"
          >
            Verified Legal Education & Trial Simulation Platform
          </Badge>
          <span className="text-xs font-mono text-zinc-500">Adalat AI Core</span>
        </div>

        {/* Middle Testimonial & Quote */}
        <div className="relative z-10 my-auto py-10 flex flex-col gap-6 max-w-lg">
          <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <Gavel className="size-6" />
          </div>

          <blockquote className="text-2xl lg:text-3xl font-serif italic text-zinc-100 leading-snug">
            &ldquo;The ability to subject a forensic cyber witness to adversarial cross-examination before real trial dates saves clients hundreds of billable hours and exposes fatal chain-of-custody gaps.&rdquo;
          </blockquote>

          <div className="flex flex-col gap-1 border-l-2 border-blue-500 pl-4">
            <span className="font-bold text-sm text-zinc-100">
              Adv. Priya Nambiar
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Criminal Defense Counsel · High Court of Judicature at Bombay
            </span>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-col">
              <span className="font-mono text-xl font-bold text-white">120+</span>
              <span className="text-[10.5px] text-zinc-400 mt-0.5">Landmark Moot Problems</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-col">
              <span className="font-mono text-xl font-bold text-emerald-400">91.0%</span>
              <span className="text-[10.5px] text-zinc-400 mt-0.5">Objection Hit-Rate</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex flex-col">
              <span className="font-mono text-xl font-bold text-amber-400">3.4x</span>
              <span className="text-[10.5px] text-zinc-400 mt-0.5">Faster Prep Time</span>
            </div>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
            <Shield className="size-3 text-blue-400" />
            <span>Encrypted Case Vault</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
            <Award className="size-3 text-amber-400" />
            <span>NLU Student Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
