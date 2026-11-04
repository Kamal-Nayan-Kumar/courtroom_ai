import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Courtroom AI · Multi-Agent Indian Courtroom Simulator",
  description:
    "Master the Indian courtroom before you step inside. Practice moot court trials and real cases with autonomous Judge, Opposing Counsel, and Witness AIs powered by BNS, BNSS, and BSA precedents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
    >
      <body className="min-h-full flex flex-col bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}
