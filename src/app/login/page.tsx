"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const DEMO_EMAIL = "advocate.nayan@gmail.com";
const DEMO_PASSWORD = "Demo@1234";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (rememberMe) localStorage.setItem("courtroom-ai-demo", "1");
      router.push("/dashboard");
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    localStorage.setItem("courtroom-ai-demo", "1");
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2 bg-white text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
      {/* LEFT COLUMN: Indian High Court Interior, dimmed with a short line */}
      <div className="hidden md:flex relative overflow-hidden bg-zinc-950 border-r border-zinc-800 min-h-screen flex-col justify-end p-10">
        <Image
          src="/courtroom_interior.png"
          alt="Indian High Courtroom Interior"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        <p className="relative z-10 text-white/85 text-sm leading-relaxed font-medium max-w-sm">
          Where every word is on record. Practice the real bench before you argue it.
        </p>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="flex flex-col justify-between p-8 sm:p-12 lg:p-14 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0 shadow-xs transition-transform group-hover:scale-105 bg-black">
              <Image
                src="/logo_icon.png"
                alt="Courtroom AI Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-950">
              Courtroom AI
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-950 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="my-auto py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Badge
              variant="outline"
              className="w-fit text-xs font-medium bg-zinc-50 text-zinc-800 border-zinc-200"
            >
              Advocate Chamber Access
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-zinc-950 tracking-tight">
              Sign in to Your Chamber
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Enter your chamber email to access your trial dossiers and simulations.
            </p>
          </div>

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
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <Separator className="w-full bg-zinc-200" />
            <span className="absolute bg-white px-3 text-xs text-zinc-400 font-medium uppercase tracking-wider">
              Or with Email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-900">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="advocate.nayan@gmail.com"
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
                <button
                  type="button"
                  onClick={() => {
                    setResetMessage("A password reset link has been dispatched to your email.");
                  }}
                  className="text-xs text-zinc-500 hover:text-zinc-950 hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
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

            {resetMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                {resetMessage}
              </div>
            )}

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

          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <Info className="size-4 text-amber-700 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-950">Demo account</p>
                <p className="text-xs text-zinc-600 font-mono">{DEMO_EMAIL} · {DEMO_PASSWORD}</p>
              </div>
            </div>
            <Button type="button" size="sm" onClick={handleDemoLogin} className="h-8 px-3 text-xs font-semibold bg-zinc-950 text-white hover:bg-zinc-800 shrink-0">
              Enter demo chamber
            </Button>
          </div>

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
      </div>
    </div>
  );
}
