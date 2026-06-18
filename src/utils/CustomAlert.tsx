import { WarningCircle, X } from '@phosphor-icons/react'

interface CustomAlertProps {
  isVisible: boolean
  message: string
  onClose: () => void
  title?: string
}

function CustomAlert({
  isVisible,
  message,
  onClose,
  title = 'Notice',
}: CustomAlertProps) {
  if (!isVisible) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--brand-header)]/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-alert-title"
      aria-describedby="custom-alert-message"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="relative w-full max-w-md animate-fade-in rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 pt-8 shadow-[var(--brand-shadow-lg)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-[var(--brand-muted)] transition-colors hover:bg-[var(--brand-bg-subtle)] hover:text-[var(--brand-ink)]"
          aria-label="Close alert"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <span className="inline-flex rounded-full bg-red-50 p-2 text-red-600 ring-1 ring-red-200">
            <WarningCircle size={22} weight="fill" aria-hidden="true" />
          </span>

          <div className="flex-1">
            <h3
              id="custom-alert-title"
              className="mb-2 text-lg font-semibold text-[var(--brand-ink)]"
            >
              {title}
            </h3>
            <p
              id="custom-alert-message"
              className="text-sm leading-relaxed text-[var(--brand-ink-secondary)]"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="brand-btn brand-btn-primary px-4 py-2"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert
