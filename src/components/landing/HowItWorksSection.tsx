import {
  ClipboardText,
  DownloadSimple,
  FileDoc,
  Sparkle,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: Icon;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Paste the job description",
    description:
      "Copy the posting from any job board or company site.",
    icon: ClipboardText,
  },
  {
    number: "02",
    title: "Upload your resume",
    description:
      "Add your .docx file. The tool reads your experience and skills.",
    icon: FileDoc,
  },
  {
    number: "03",
    title: "AI optimization",
    description:
      "Keywords and bullet points are aligned to the role requirements.",
    icon: Sparkle,
  },
  {
    number: "04",
    title: "Download your resume",
    description:
      "Export an ATS-friendly .docx ready to submit.",
    icon: DownloadSimple,
  },
];

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Four steps from job posting to a resume ready to send.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <li
                key={step.number}
                className="relative rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-teal-700">
                    {step.number}
                  </span>
                  <span className="rounded-lg bg-teal-50 p-2 text-teal-700">
                    <StepIcon size={22} weight="duotone" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorksSection;
