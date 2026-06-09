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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="/srm-logo.png"
            alt="Smart Resume Optimizer"
            className="h-9 w-9 rounded-full border border-slate-200 object-cover"
          />
          <span className="text-base font-semibold text-slate-900">
            Smart Resume Optimizer
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LandingButton onClick={onTryDemo}>Try the Demo</LandingButton>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
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
          className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleNavClick}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
