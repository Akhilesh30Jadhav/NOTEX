import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems = [],
  featureItems = [],
  authButtons,
  userMenu,
  logo,
  className,
}) => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
    setFeaturesOpen(false);
  }, [location.pathname]);

  const coreFeatures = featureItems.slice(0, 8);

  return (
    <>
      <header
        className={cn(
          "fixed top-4 inset-x-0 z-[5000] mx-auto",
          "w-[min(1120px,calc(100%-1rem))]",
          "rounded-xl border border-white/10 bg-zinc-950/85 backdrop-blur-xl",
          "shadow-[0_10px_30px_rgba(0,0,0,0.4)]",
          className
        )}
      >
        <div className="h-14 px-3 sm:px-4 lg:px-5 flex items-center justify-between gap-3">
          <div className="shrink-0">{logo}</div>

          <nav className="hidden md:flex items-center gap-1 min-w-0">
            {navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className={cn(
                  "text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                  location.pathname === item.link
                    ? "text-white bg-white/10"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            ))}

            {coreFeatures.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setFeaturesOpen((prev) => !prev)}
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors",
                    featuresOpen
                      ? "text-white bg-white/10"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  )}
                >
                  Features
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", featuresOpen && "rotate-180")} />
                </button>

                {featuresOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-white/10 bg-zinc-950 shadow-2xl py-2">
                    {coreFeatures.map((item) => (
                      <Link
                        key={item.link}
                        to={item.link}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:text-white hover:bg-white/5"
                      >
                        {item.icon && <span className="w-4 h-4 shrink-0">{item.icon}</span>}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-2 shrink-0">{userMenu || authButtons}</div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-neutral-200 hover:text-white p-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed top-[4.25rem] inset-x-0 z-[4999] mx-auto w-[min(1120px,calc(100%-1rem))] rounded-xl border border-white/10 bg-zinc-950/95 backdrop-blur-xl shadow-[0_12px_34px_rgba(0,0,0,0.45)]">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.link}
                to={item.link}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                  location.pathname === item.link
                    ? "text-white bg-white/10"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                <span>{item.name}</span>
              </Link>
            ))}

            {coreFeatures.length > 0 && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-neutral-500">Features</div>
                <div className="grid grid-cols-2 gap-1">
                  {coreFeatures.map((item) => (
                    <Link
                      key={item.link}
                      to={item.link}
                      className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[13px] text-neutral-300 hover:text-white hover:bg-white/5"
                    >
                      {item.icon && <span className="w-3.5 h-3.5">{item.icon}</span>}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="pt-3 mt-3 border-t border-white/10">{userMenu || authButtons}</div>
          </div>
        </div>
      )}

      <div className="h-[4.5rem]" />
    </>
  );
};
