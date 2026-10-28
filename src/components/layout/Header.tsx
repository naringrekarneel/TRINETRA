import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, Sun, Moon, Github, Hash } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { NumBadge, useElementNumbers } from "../../context/ElementNumberContext";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { showNumbers, toggleNumbers } = useElementNumbers();
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/", id: 3 },
    { label: "How It Works", path: "/how-it-works", id: 4 },
    { label: "Security Guide", path: "/security-guide", id: 5 },
    { label: "About / Open Source", path: "/about", id: 6 },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-charcoal-900/90 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand (#1 & #2) */}
          <div className="relative">
            <NumBadge id={1} />
            <Link
              to="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 rounded-md p-1"
              aria-label="Trinetra Home"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-800 text-white dark:bg-forest-600">
                <Shield className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Trinetra
                </span>
                <span className="relative hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <NumBadge id={2} inline />
                  Think Before You Scan
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation (#3, #4, #5, #6) */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <div key={link.path} className="relative">
                  <NumBadge id={link.id} />
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      active
                        ? "bg-slate-100 text-forest-800 dark:bg-charcoal-800 dark:text-forest-400 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-charcoal-800"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Controls: Element Numbers, Theme & GitHub (#7, #8) */}
          <div className="flex items-center gap-2">
            {/* Element Numbers Toggle */}
            <button
              onClick={toggleNumbers}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-lg border transition-colors ${
                showNumbers
                  ? "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700"
                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-charcoal-800 dark:text-slate-400 dark:border-slate-700"
              }`}
              title="Toggle Light Numbering on elements"
              aria-label="Toggle Element Numbers"
            >
              <Hash className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Numbers: {showNumbers ? "ON" : "OFF"}</span>
            </button>

            {/* Theme Toggle (#7) */}
            <div className="relative">
              <NumBadge id={7} />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 transition-colors"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Sun className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* GitHub (#8) */}
            <div className="relative">
              <NumBadge id={8} />
              <a
                href="https://github.com/placeholder-org/trinetra"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600 transition-colors"
                aria-label="GitHub Repository (opens in new tab)"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden border-t border-slate-200 py-3 dark:border-slate-800"
            aria-label="Mobile Navigation"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      active
                        ? "bg-slate-100 text-forest-800 dark:bg-charcoal-800 dark:text-forest-400 font-semibold"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-charcoal-800"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    #{link.id} {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
