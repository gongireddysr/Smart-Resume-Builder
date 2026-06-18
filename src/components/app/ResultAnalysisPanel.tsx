import type { ReactNode } from "react";
import type { ResumeModificationResponse } from "../../types/resume";
import InlineAlert from "./InlineAlert";

interface ResultAnalysisPanelProps {
  result: ResumeModificationResponse;
}

function AnalysisSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ResultAnalysisPanel({ result }: ResultAnalysisPanelProps) {
  const hasSkillsChanges =
    (result.skills_added?.length ?? 0) > 0 ||
    (result.skills_removed?.length ?? 0) > 0 ||
    (result.skills_boosted?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-5">
      {result.warnings?.length > 0 && (
        <InlineAlert variant="warning" title="Review before submitting">
          <ul className="list-disc space-y-1 pl-4">
            {result.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </InlineAlert>
      )}

      {result.change_summary?.length > 0 && (
        <AnalysisSection title="Changes made">
          <ul className="space-y-2">
            {result.change_summary.map((change, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-600" />
                {change}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}

      {hasSkillsChanges && (
        <AnalysisSection title="Skills optimization">
          {result.skills_added?.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Added
              </p>
              <div className="flex flex-wrap gap-2">
                {result.skills_added.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-teal-200 bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800"
                  >
                    +{skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.skills_boosted?.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Emphasized
              </p>
              <div className="flex flex-wrap gap-2">
                {result.skills_boosted.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.skills_removed?.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                Removed
              </p>
              <div className="flex flex-wrap gap-2">
                {result.skills_removed.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-red-200 bg-red-50 px-2 py-1 text-xs font-medium text-red-800"
                  >
                    -{skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </AnalysisSection>
      )}

      {result.experience_transformed?.length > 0 && (
        <AnalysisSection title="Experience updates">
          <ul className="space-y-2">
            {result.experience_transformed.map((role, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                {role}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}

      {result.suggestions?.length > 0 && (
        <AnalysisSection title="Next steps">
          <ul className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
              >
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                {suggestion}
              </li>
            ))}
          </ul>
        </AnalysisSection>
      )}
    </div>
  );
}

export default ResultAnalysisPanel;
