"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Scale,
  ArrowRight,
  Shield,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("kamal.nayan@chamber.law");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
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
      {/* LEFT COLUMN: Clean, High-Craft Authentication Form */}
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
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Central Form Container */}
        <div className="my-auto py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant="outline"
              className="w-fit text-[10.5px] font-mono bg-zinc-50 text-zinc-800 border-zinc-200"
            >
              Advocate Chamber Access
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 tracking-tight">
              Sign in to Your Chamber
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Enter your Bar Council credentials or chamber email to access your trial dossiers.
            </p>
          </div>

          {/* Social / SSO Auth */}
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="w-full h-10 text-xs font-semibold border-zinc-200 hover:bg-zinc-50 text-zinc-800 shadow-2xs flex items-center justify-center gap-2"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Workspace</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full bg-zinc-200" />
            <span className="absolute bg-white px-3 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Or with Bar ID / Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-900">
                Email address or Bar Council ID
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="e.g. counsel@bombaybar.in or KAR/1084/2026"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-900">
                  Password
                </Label>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("A password reset link has been dispatched to your registered Bar email.");
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter chamber password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 text-xs bg-zinc-50/60 border-zinc-200 focus-visible:ring-zinc-950"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
              />
              <Label
                htmlFor="remember"
                className="text-xs text-zinc-600 font-normal cursor-pointer select-none"
              >
                Remember this chamber session on this workstation
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 h-10 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm"
            >
              <span>{isSubmitting ? "Authenticating Counsel..." : "Sign in to Chamber"}</span>
              <ArrowRight className="size-3.5 ml-1.5" />
            </Button>
          </form>

          {/* Toggle to Sign Up */}
          <div className="text-center text-xs text-zinc-600">
            <span>Don&apos;t have a verified chamber profile? </span>
            <Link
              href="/signup"
              className="font-bold text-zinc-950 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Create Advocate Account</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Encrypted with 256-bit TLS</span>
          <span>BNS 2023 Compliant</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Editorial Judicial Visual & Testimonial Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-zinc-950 text-white relative overflow-hidden border-l border-zinc-800">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[11px] font-mono text-zinc-300 border-zinc-800 bg-zinc-900/80 px-3 py-1"
          >
            Supreme Court & Sessions Court AI Simulator
          </Badge>
          <span className="text-xs font-mono text-zinc-500">v2.4.0 Engine</span>
        </div>

        {/* Middle Testimonial & Quote */}
        <div className="relative z-10 my-auto py-12 flex flex-col gap-6 max-w-lg">
          <div className="size-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
            <Scale className="size-6" />
          </div>

          <blockquote className="text-2xl lg:text-3xl font-serif italic text-zinc-100 leading-snug">
            &ldquo;Courtroom AI transformed how our junior advocates prepare for contested bail hearings under the BNSS. Simulating Judge Deshmukh&apos;s interruptions before stepping into Sessions Court is priceless.&rdquo;
          </blockquote>

          <div className="flex flex-col gap-1 border-l-2 border-amber-500 pl-4">
            <span className="font-bold text-sm text-zinc-100">
              Senior Adv. R. K. Singhania
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Designated Senior Counsel · Supreme Court of India · Bar #D/142
            </span>
          </div>
        </div>

        {/* Bottom Feature Badges */}
        <div className="relative z-10 pt-6 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span>BNS ↔ IPC Transition Engine</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
            <span className="size-2 rounded-full bg-blue-400" />
            <span>Autonomous AI Coram</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
            <span className="size-2 rounded-full bg-amber-400" />
            <span>Witness Prep & Trap Lab</span>
          </div>
        </div>
      </div>
    </div>
  );
}
