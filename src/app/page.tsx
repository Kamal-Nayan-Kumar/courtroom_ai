import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CourtroomSimulatorMockup } from "@/components/CourtroomSimulatorMockup";
import { PreTrialWorkflow } from "@/components/PreTrialWorkflow";
import { AutonomousAgentsSection } from "@/components/AutonomousAgentsSection";
import { DashboardPreviewSection } from "@/components/DashboardPreviewSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { FaqSection } from "@/components/FaqSection";
import { CtaFooter } from "@/components/CtaFooter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Sticky Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Interactive Hero Showcase: 3-Pane Courtroom Simulator */}
        <CourtroomSimulatorMockup />

        {/* 4. Pre-Trial & Witness Prep Workflow */}
        <PreTrialWorkflow />

        {/* 5. Autonomous Courtroom Agents Showcase */}
        <AutonomousAgentsSection />

        {/* 6. User Dashboard & Analytics Preview */}
        <DashboardPreviewSection />

        {/* 7. Student vs Advocate Benefits */}
        <BenefitsSection />

        {/* 8. FAQ Accordion */}
        <FaqSection />
      </main>

      {/* 9. Final CTA & 4-Column Footer */}
      <CtaFooter />
    </div>
  );
}
