import { useState } from "react";

const beforeBullet =
  "Managed team projects and improved workflow efficiency using various software tools.";

const afterBullet =
  "Led cross-functional delivery of 4 product launches using Jira and Confluence, reducing cycle time by 18%.";

function BeforeAfterSection() {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");

  return (
    <section
      id="example"
      className="border-b border-slate-200 bg-slate-50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Example resume improvement
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            Illustrative before and after for one experience bullet. Your results
            will reflect your resume and the job posting you provide.
          </p>
        </div>

        <div className="mt-10 sm:hidden">
          <div
            className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
            role="tablist"
            aria-label="Before and after example"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "before"}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "before"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("before")}
            >
              Before
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "after"}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "after"
                  ? "bg-teal-600 text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setActiveTab("after")}
            >
              After
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Experience bullet
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-700">
              {activeTab === "before" ? beforeBullet : afterBullet}
            </p>
          </div>
        </div>

        <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Before
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {beforeBullet}
            </p>
          </article>

          <article className="rounded-xl border border-teal-200 bg-white p-6 ring-1 ring-teal-100">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              After
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-700">
              {afterBullet}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default BeforeAfterSection;
