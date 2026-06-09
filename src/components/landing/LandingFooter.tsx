function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-2.5">
          <img
            src="/srm-logo.png"
            alt=""
            aria-hidden="true"
            className="h-8 w-8 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-sm font-semibold text-slate-900">
            Smart Resume Optimizer
          </span>
        </div>

        <p className="max-w-xl text-sm leading-relaxed text-slate-500">
          Fit estimates and keyword suggestions are guidance only. They are not
          official ATS scores or hiring guarantees.
        </p>

        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Smart Resume Optimizer
        </p>
      </div>
    </footer>
  );
}

export default LandingFooter;
