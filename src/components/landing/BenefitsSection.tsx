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
    description:
      "Surface the terms recruiters and screening systems look for.",
    icon: Key,
    tinted: true,
  },
  {
    title: "Better resume-job matching",
    description:
      "Align your experience language with what the posting asks for.",
    icon: Target,
  },
  {
    title: "Faster applications",
    description:
      "Stop rewriting from scratch for every role.",
    icon: Clock,
    tinted: true,
  },
  {
    title: "Professional improvements",
    description:
      "Clearer bullets, stronger skills section, tighter summary.",
    icon: Medal,
  },
];

function BenefitsSection() {
  return (
    <section id="benefits" className="border-b border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Why job seekers use it
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Focus on fit, clarity, and speed when every application counts.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const BenefitIcon = benefit.icon;
            return (
              <article
                key={benefit.title}
                className={`rounded-xl border border-slate-200 p-6 ${
                  benefit.tinted ? "bg-slate-50" : "bg-white"
                }`}
              >
                <span className="inline-flex rounded-lg bg-teal-50 p-2.5 text-teal-700">
                  <BenefitIcon size={24} weight="duotone" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
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
