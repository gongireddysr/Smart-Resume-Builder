import type { ReactNode } from "react";

type LandingButtonVariant = "primary" | "secondary" | "accent";

interface LandingButtonProps {
  children: ReactNode;
  variant?: LandingButtonVariant;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  className?: string;
}

const variantClass: Record<LandingButtonVariant, string> = {
  primary: "brand-btn brand-btn-primary",
  secondary: "brand-btn brand-btn-secondary",
  accent: "brand-btn brand-btn-accent",
};

function LandingButton({
  children,
  variant = "primary",
  onClick,
  href,
  type = "button",
  className = "",
}: LandingButtonProps) {
  const classes = `${variantClass[variant]} ${className}`;

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
