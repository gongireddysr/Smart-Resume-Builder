import LandingNav from "../components/landing/LandingNav";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import BenefitsSection from "../components/landing/BenefitsSection";
import BeforeAfterSection from "../components/landing/BeforeAfterSection";
import FinalCtaSection from "../components/landing/FinalCtaSection";
import LandingFooter from "../components/landing/LandingFooter";
import "../styles/landing.css";

interface LandingPageProps {
  onTryDemo: () => void;
}

function LandingPage({ onTryDemo }: LandingPageProps) {
  return (
    <div className="landing-page min-h-[100dvh]">
      <LandingNav onTryDemo={onTryDemo} />
      <main>
        <HeroSection onTryDemo={onTryDemo} />
        <HowItWorksSection />
        <BenefitsSection />
        <BeforeAfterSection />
        <FinalCtaSection onTryDemo={onTryDemo} />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
