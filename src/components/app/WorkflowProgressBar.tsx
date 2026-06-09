import { Check } from "@phosphor-icons/react";

interface WorkflowProgressBarProps {
  detailsComplete: boolean;
}

type StepState = "completed" | "active" | "upcoming";

interface Step {
  id: string;
  label: string;
  shortLabel: string;
  state: StepState;
}

function StepIndicator({ state }: { state: StepState }) {
  if (state === "completed") {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
        <Check size={16} weight="bold" aria-hidden="true" />
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-600 bg-teal-50">
        <span className="h-2.5 w-2.5 rounded-full bg-teal-600" aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white">
      <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden="true" />
    </span>
  );
}

function WorkflowProgressBar({ detailsComplete }: WorkflowProgressBarProps) {
  const steps: Step[] = [
    { id: "landing", label: "Landing", shortLabel: "Landing", state: "completed" },
    {
      id: "details",
      label: "Resume & Job Details",
      shortLabel: "Details",
      state: detailsComplete ? "completed" : "active",
    },
    { id: "results", label: "Results", shortLabel: "Results", state: "upcoming" },
  ];

  const activeStepId = "details";

  return (
    <nav
      aria-label="Application progress"
      className="border-b border-slate-200 bg-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center justify-between gap-2 sm:justify-center sm:gap-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const connectorComplete =
              step.state === "completed" ||
              (index === 1 && detailsComplete);

            return (
              <li
                key={step.id}
                aria-current={step.id === activeStepId ? "step" : undefined}
                className={`flex items-center ${isLast ? "" : "flex-1 sm:flex-none"}`}
              >
                <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                  <StepIndicator state={step.state} />
                  <div className="min-w-0">
                    <p
                      className={`truncate text-xs font-semibold sm:text-sm ${
                        step.state === "upcoming"
                          ? "text-slate-400"
                          : step.state === "active"
                            ? "text-teal-700"
                            : "text-slate-700"
                      }`}
                    >
                      <span className="sm:hidden">{step.shortLabel}</span>
                      <span className="hidden sm:inline">
                        {step.state === "completed" && step.id === "details"
                          ? "Resume & Job Details"
                          : step.label}
                      </span>
                    </p>
                    {step.state === "completed" && step.id === "details" && (
                      <p className="hidden text-xs text-teal-700 sm:block">
                        Ready to generate
                      </p>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`mx-2 hidden h-px flex-1 sm:mx-6 sm:block sm:w-24 sm:flex-none lg:w-32 ${
                      connectorComplete ? "bg-teal-300" : "bg-slate-200"
                    }`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default WorkflowProgressBar;
