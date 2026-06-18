import { Check } from "@phosphor-icons/react";

export type WorkflowPhase = "input" | "generating" | "results";

interface WorkflowProgressBarProps {
  phase: WorkflowPhase;
  detailsComplete?: boolean;
}

type StepState = "completed" | "active" | "upcoming";

interface Step {
  id: string;
  label: string;
  shortLabel: string;
  state: StepState;
  sublabel?: string;
}

function StepIndicator({ state }: { state: StepState }) {
  if (state === "completed") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--brand-primary)] text-white shadow-sm ring-2 ring-[var(--brand-primary-soft)]">
        <Check size={16} weight="bold" aria-hidden="true" />
      </span>
    );
  }

  if (state === "active") {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[var(--brand-primary)] bg-[var(--brand-primary-soft)] shadow-sm">
        <span
          className="h-2.5 w-2.5 rounded-full bg-[var(--brand-primary)]"
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--brand-border-strong)] bg-[var(--brand-surface)]">
      <span className="h-2 w-2 rounded-full bg-[var(--brand-border)]" aria-hidden="true" />
    </span>
  );
}

function getSteps(phase: WorkflowPhase, detailsComplete: boolean): Step[] {
  const detailsState: StepState =
    phase === "input" && !detailsComplete ? "active" : "completed";

  const resultsState: StepState =
    phase === "results"
      ? "completed"
      : phase === "generating"
        ? "active"
        : "upcoming";

  return [
    { id: "landing", label: "Landing", shortLabel: "Landing", state: "completed" },
    {
      id: "details",
      label: "Resume & Job Details",
      shortLabel: "Details",
      state: detailsState,
      sublabel:
        detailsState === "completed" && phase === "input"
          ? "Ready to generate"
          : undefined,
    },
    {
      id: "results",
      label: "Results",
      shortLabel: "Results",
      state: resultsState,
      sublabel: phase === "generating" ? "Generating resume..." : undefined,
    },
  ];
}

function WorkflowProgressBar({
  phase,
  detailsComplete = false,
}: WorkflowProgressBarProps) {
  const steps = getSteps(phase, detailsComplete);
  const activeStepId =
    phase === "results" ? "results" : phase === "generating" ? "results" : "details";

  return (
    <nav aria-label="Application progress" className="brand-progress">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center justify-between gap-2 sm:justify-center sm:gap-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const connectorComplete = step.state === "completed";

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
                          ? "text-[var(--brand-muted)]"
                          : step.state === "active"
                            ? "text-[var(--brand-primary)]"
                            : "text-[var(--brand-ink)]"
                      }`}
                    >
                      <span className="sm:hidden">{step.shortLabel}</span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </p>
                    {step.sublabel && (
                      <p className="hidden text-xs font-medium text-[var(--brand-primary)] sm:block">
                        {step.sublabel}
                      </p>
                    )}
                    {phase === "results" && step.id === "results" && (
                      <p className="hidden text-xs font-medium text-[var(--brand-primary)] sm:block">
                        Resume ready
                      </p>
                    )}
                  </div>
                </div>

                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`mx-2 hidden h-0.5 flex-1 sm:mx-6 sm:block sm:w-24 sm:flex-none lg:w-32 ${
                      connectorComplete
                        ? "bg-[var(--brand-primary)]"
                        : "bg-[var(--brand-border)]"
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
