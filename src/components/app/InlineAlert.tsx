import { Info, Warning, WarningCircle, X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

type InlineAlertVariant = "info" | "warning" | "error";

interface InlineAlertProps {
  variant?: InlineAlertVariant;
  title?: string;
  children: ReactNode;
  onDismiss?: () => void;
}

const variantStyles: Record<
  InlineAlertVariant,
  { container: string; icon: typeof Info; iconClass: string }
> = {
  info: {
    container: "border-slate-200 bg-slate-50 text-slate-700",
    icon: Info,
    iconClass: "text-slate-500",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    icon: Warning,
    iconClass: "text-amber-600",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: WarningCircle,
    iconClass: "text-red-600",
  },
};

function InlineAlert({ variant = "info", title, children, onDismiss }: InlineAlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      role="alert"
      className={`relative flex gap-3 rounded-lg border px-4 py-3 pr-10 text-sm leading-relaxed ${styles.container}`}
    >
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 text-slate-500 transition-colors hover:bg-black/5 hover:text-slate-700"
          aria-label="Dismiss alert"
        >
          <X size={16} weight="bold" aria-hidden="true" />
        </button>
      )}
      <Icon
        size={20}
        weight="fill"
        className={`mt-0.5 flex-shrink-0 ${styles.iconClass}`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export default InlineAlert;
