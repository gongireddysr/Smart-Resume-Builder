import {
  Clock,
  Key,
  Medal,
  Target,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface Benefit {
  title: string;
  description: string;
  icon: Icon;
  tinted?: boolean;
}

const benefits: Benefit[] = [
  {
    title: "ATS keyword optimization",
    description: "Surface the terms recruiters and screening systems look for.",
    icon: Key,
    tinted: true,
  },
  {
    title: "Better resume-job matching",
    description: "Align your experience language with what the posting asks for.",
    icon: Target,
  },
  {
    title: "Faster applications",
    description: "Stop rewriting from scratch for every role.",
    icon: Clock,
    tinted: true,
  },
  {
    title: "Professional improvements",
    description: "Clearer bullets, stronger skills section, tighter summary.",
    icon: Medal,
  },
];

function BenefitsSection() {
  return (
    <section id="benefits" className="brand-section py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="brand-heading text-3xl sm:text-4xl">Why job seekers use it</h2>
          <p className="brand-lead mt-4 text-lg">
            Focus on fit, clarity, and speed when every application counts.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const BenefitIcon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className={`brand-card p-6 ${
                  benefit.tinted ? "bg-[var(--brand-surface-warm)]" : ""
                }`}
              >
                <span className="brand-icon-wrap">
                  <BenefitIcon size={24} weight="duotone" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-[var(--brand-ink)]">
                  {benefit.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--brand-ink-secondary)]">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BenefitsSection;
