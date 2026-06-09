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
    <section
      className={`flex min-h-[280px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white lg:min-h-[420px] ${className}`}
    >
      <div className="flex flex-shrink-0 flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2.5">
            {icon && (
              <span className="mt-0.5 inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">
                {icon}
              </span>
            )}
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              {description && (
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
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

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">{children}</div>

      {footer && (
        <div className="border-t border-slate-200 px-4 py-3 sm:px-5">{footer}</div>
      )}
    </section>
  );
}

export default AppCard;
