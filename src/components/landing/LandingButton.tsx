import type { ReactNode } from "react";

type LandingButtonVariant = "primary" | "secondary";

interface LandingButtonProps {
  children: ReactNode;
  variant?: LandingButtonVariant;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  className?: string;
}

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600";

const variantClass: Record<LandingButtonVariant, string> = {
  primary: "bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
};

function LandingButton({
  children,
  variant = "primary",
  onClick,
  href,
  type = "button",
  className = "",
}: LandingButtonProps) {
  const classes = `${baseClass} ${variantClass[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export default LandingButton;
