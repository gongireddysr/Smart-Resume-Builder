import { useState } from "react";

const beforeBullet =
  "Managed team projects and improved workflow efficiency using various software tools.";

const afterBullet =
  "Led cross-functional delivery of 4 product launches using Jira and Confluence, reducing cycle time by 18%.";

function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  return (
    <section id="example" className="brand-section-alt py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="brand-heading text-3xl sm:text-4xl">
            Example resume improvement
          </h2>
          <p className="brand-lead mt-4 text-lg">
            Illustrative before and after for one experience bullet. Your results
            will reflect your resume and the job posting you provide.
          </p>
        </div>

        <div className="mt-10 sm:hidden">
          <div
            className="inline-flex rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-1 shadow-sm"
            role="tablist"
            aria-label="Before and after example"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "before"}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "before"
                  ? "bg-[var(--brand-header)] text-white shadow-sm"
                  : "text-[var(--brand-ink-secondary)] hover:text-[var(--brand-ink)]"
              }`}
              onClick={() => setActiveTab("before")}
            >
              Before
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "after"}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === "after"
                  ? "bg-[var(--brand-primary)] text-white shadow-sm"
                  : "text-[var(--brand-ink-secondary)] hover:text-[var(--brand-ink)]"
              }`}
              onClick={() => setActiveTab("after")}
            >
              After
            </button>
          </div>

          <div className="brand-card mt-4 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
              Experience bullet
            </p>
            <p className="mt-3 text-base leading-relaxed text-[var(--brand-ink-secondary)]">
              {activeTab === "before" ? beforeBullet : afterBullet}
            </p>
          </div>
        </div>

        <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2">
          <article className="brand-card p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-muted)]">
              Before
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink-secondary)]">
              {beforeBullet}
            </p>
          </article>

          <article className="brand-card border-[var(--brand-primary)] p-6 ring-2 ring-[var(--brand-primary-soft)]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
              After
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--brand-ink-secondary)]">
              {afterBullet}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfterSection;
