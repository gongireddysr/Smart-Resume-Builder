function ApplicationHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2.5 px-4 sm:px-6 lg:px-8">
        <img
          src="/srm-logo.png"
          alt=""
          aria-hidden="true"
          className="h-9 w-9 rounded-full border border-slate-200 object-cover"
        />
        <div>
          <p className="text-base font-semibold text-slate-900">
            Smart Resume Optimizer
          </p>
          <p className="text-xs text-slate-500">Resume tailoring workspace</p>
        </div>
      </div>
    </header>
  );
}

export default ApplicationHeader;
