import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import LandingButton from "./LandingButton";

interface HeroSectionProps {
  onTryDemo: () => void;
}

function HeroSection({ onTryDemo }: HeroSectionProps) {
  return (
    <section className="brand-section">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="landing-reveal">
          <p className="brand-eyebrow mb-4">ATS Resume Optimizer</p>
          <h1 className="brand-heading text-4xl sm:text-5xl lg:leading-[1.1]">
            Tailor your resume to every job posting
          </h1>
          <p className="brand-lead mt-5 max-w-xl text-lg">
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

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-[var(--brand-muted)]">
            Built for active job seekers who want stronger applications, not
            generic templates.
          </p>
        </div>

        <div className="landing-reveal lg:justify-self-end">
          <div className="brand-panel-muted p-6 shadow-[var(--brand-shadow)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                Resume preview
              </span>
              <span className="brand-badge brand-badge-success">Keyword aligned</span>
            </div>

            <div className="brand-card p-5">
              <p className="text-base font-semibold text-[var(--brand-ink)]">
                Alex Morgan
              </p>
              <p className="mt-1 text-sm text-[var(--brand-muted)]">
                Product Manager · San Francisco, CA
              </p>

              <div className="mt-5 border-t border-[var(--brand-border)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                  Professional summary
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--brand-ink-secondary)]">
                  Product leader with 6 years driving roadmap execution,
                  cross-functional delivery, and measurable growth outcomes.
                </p>
              </div>

              <div className="mt-4 border-t border-[var(--brand-border)] pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
                  Matched keywords
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Roadmap", "Stakeholders", "Agile", "SQL", "A/B testing"].map(
                    (keyword) => (
                      <span
                        key={keyword}
                        className="brand-badge brand-badge-success inline-flex items-center gap-1 rounded-md"
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
