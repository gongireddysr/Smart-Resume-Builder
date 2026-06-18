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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-alert-title"
      aria-describedby="custom-alert-message"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 pt-8 shadow-xl animate-fade-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close alert"
        >
          <X size={18} weight="bold" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-4 pr-6">
          <span className="inline-flex rounded-full bg-red-50 p-2 text-red-600">
            <WarningCircle size={22} weight="fill" aria-hidden="true" />
          </span>

          <div className="flex-1">
            <h3
              id="custom-alert-title"
              className="mb-2 text-lg font-semibold text-slate-900"
            >
              {title}
            </h3>
            <p
              id="custom-alert-message"
              className="text-sm leading-relaxed text-slate-600"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert
