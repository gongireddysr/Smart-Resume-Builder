function ApplicationHeader() {
  const handleLogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <header className="brand-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90"
          aria-label="Back to landing page"
        >
          <img
            src="/srm-logo.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-9 rounded-full border border-white/20 object-cover ring-2 ring-teal-500/40"
          />
          <div>
            <p className="text-base font-semibold text-white">Smart Resume Optimizer</p>
            <p className="text-xs text-[var(--brand-header-muted)]">
              Resume tailoring workspace
            </p>
          </div>
        </a>
      </div>
    </header>
  )
}

export default ApplicationHeader
