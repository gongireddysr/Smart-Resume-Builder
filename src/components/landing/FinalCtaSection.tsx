import { ArrowRight } from "@phosphor-icons/react";
import LandingButton from "./LandingButton";

interface FinalCtaSectionProps {
  onTryDemo: () => void;
}

function FinalCtaSection({ onTryDemo }: FinalCtaSectionProps) {
  return (
    <section className="brand-section py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="brand-panel-muted rounded-2xl px-6 py-12 text-center shadow-[var(--brand-shadow)] sm:px-12 sm:py-16">
          <h2 className="brand-heading text-3xl sm:text-4xl">
            Ready to optimize your next application?
          </h2>
          <p className="brand-lead mx-auto mt-4 max-w-2xl text-lg">
            Try the demo with a real job posting and your own resume.
          </p>
          <div className="mt-8 flex justify-center">
            <LandingButton onClick={onTryDemo}>
              Try the Demo
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </LandingButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinalCtaSection;
