import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import LandingButton from "./LandingButton";

interface HeroSectionProps {
  onTryDemo: () => void;
}

function HeroSection({ onTryDemo }: HeroSectionProps) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="landing-reveal">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-teal-700">
            ATS Resume Optimizer
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:leading-[1.1]">
            Tailor your resume to every job posting
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
            Paste a job description, upload your resume, and get an ATS-friendly
            version matched to the role.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingButton onClick={onTryDemo}>
              Try the Demo
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </LandingButton>
            <LandingButton variant="secondary" href="#how-it-works">
              Learn More
            </LandingButton>
          </div>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-slate-500">
            Built for active job seekers who want stronger applications, not
            generic templates.
          </p>
        </div>

        <div className="landing-reveal lg:justify-self-end">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Resume preview
              </span>
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                Keyword aligned
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-slate-900">
                Alex Morgan
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Product Manager · San Francisco, CA
              </p>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Professional summary
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Product leader with 6 years driving roadmap execution,
                  cross-functional delivery, and measurable growth outcomes.
                </p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Matched keywords
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Roadmap", "Stakeholders", "Agile", "SQL", "A/B testing"].map(
                    (keyword) => (
                      <span
                        key={keyword}
                        className="inline-flex items-center gap-1 rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800"
                      >
                        <CheckCircle size={12} weight="fill" aria-hidden="true" />
                        {keyword}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
