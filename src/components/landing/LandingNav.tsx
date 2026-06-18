import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import LandingButton from "./LandingButton";

interface LandingNavProps {
  onTryDemo: () => void;
}

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
  { label: "Example", href: "#example" },
];

function LandingNav({ onTryDemo }: LandingNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="brand-header sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/srm-logo.png"
            alt="Smart Resume Optimizer"
            className="h-9 w-9 rounded-full border border-white/20 object-cover ring-2 ring-teal-500/40"
          />
          <span className="text-base font-semibold text-white">
            Smart Resume Optimizer
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="brand-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LandingButton onClick={onTryDemo}>Try the Demo</LandingButton>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-[var(--brand-header-muted)] hover:bg-white/10 hover:text-white lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="landing-mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="landing-mobile-nav"
          className="border-t border-white/10 bg-[var(--brand-header)] px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--brand-header-muted)] hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <LandingButton onClick={onTryDemo} className="w-full">
                Try the Demo
              </LandingButton>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default LandingNav;
