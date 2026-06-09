import { ArrowRight } from "@phosphor-icons/react";
import LandingButton from "./LandingButton";

interface FinalCtaSectionProps {
  onTryDemo: () => void;
}

function FinalCtaSection({ onTryDemo }: FinalCtaSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ready to optimize your next application?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
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
