import ApplicationHeader from '../components/app/ApplicationHeader'
import WorkflowProgressBar from '../components/app/WorkflowProgressBar'
import '../styles/product.css'

function LoadingSkeleton() {
  return (
    <div className="app-page flex min-h-[100dvh] flex-col">
      <ApplicationHeader />
      <WorkflowProgressBar phase="generating" detailsComplete />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="max-w-2xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="mt-3 h-4 w-full max-w-lg animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(280px,360px)_1fr]">
          <aside className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-6 h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </aside>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <div className="mb-4 h-5 w-48 animate-pulse rounded bg-slate-200" />
            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
                <div key={line} className="space-y-2">
                  <div className="h-4 animate-pulse rounded bg-slate-100" />
                  <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default LoadingSkeleton
