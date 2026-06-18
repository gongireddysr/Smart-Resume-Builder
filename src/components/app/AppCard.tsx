import type { ReactNode } from "react";

interface AppCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

function AppCard({
  title,
  description,
  icon,
  status,
  actions,
  footer,
  children,
  className = "",
}: AppCardProps) {
  return (
    <section className={`brand-card flex min-h-[280px] flex-col lg:min-h-[420px] ${className}`}>
      <div className="brand-card-header flex flex-shrink-0 flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2.5">
            {icon && <span className="brand-icon-wrap">{icon}</span>}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-[var(--brand-ink)]">{title}</h2>
              {description && (
                <p className="mt-1 text-sm leading-relaxed text-[var(--brand-muted)]">
                  {description}
                </p>
              )}
            </div>
          </div>
          {status && <div className="mt-3 sm:ml-11">{status}</div>}
        </div>
        {actions && (
          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:ml-4">
            {actions}
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-[var(--brand-surface)] p-4 sm:p-5">
        {children}
      </div>

      {footer && (
        <div className="border-t border-[var(--brand-border)] bg-[var(--brand-bg-subtle)] px-4 py-3 sm:px-5">
          {footer}
        </div>
      )}
    </section>
  );
}

export default AppCard;
