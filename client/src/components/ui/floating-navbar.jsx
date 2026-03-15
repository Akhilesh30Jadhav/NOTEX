import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

export const FloatingNav = ({
  navItems,
  featureItems,
  authButtons,
  userMenu,
  logo,
  className,
}) => {
  const location = useLocation();
  const [showFeatures, setShowFeatures] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "fixed top-3 inset-x-0 z-[5000] mx-auto",
            "w-[min(1180px,calc(100%-1rem))]",
            "rounded-2xl border border-white/[0.1] bg-zinc-950/78 backdrop-blur-2xl",
            "shadow-[0_14px_40px_rgba(0,0,0,0.45)]",
            className
          )}
        >
          <div className="h-16 px-4 sm:px-5 lg:px-6 flex items-center justify-between gap-4">
            <div className="shrink-0">{logo}</div>

            <div className="hidden md:flex items-center gap-1.5 min-w-0">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className={cn(
                      "text-[15px] font-semibold px-3.5 py-2 rounded-xl transition-all",
                      location.pathname === item.link
                        ? "text-white bg-white/[0.1]"
                        : "text-neutral-300 hover:text-white hover:bg-white/[0.07]"
                    )}
                  >
                    <span>{item.name}</span>
                  </Link>
                ))}

                {featureItems && featureItems.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowFeatures(true)}
                    onMouseLeave={() => setShowFeatures(false)}
                  >
                    <button className="flex items-center gap-1.5 text-[15px] font-semibold px-3.5 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.07] transition-all">
                      Features
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showFeatures && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zinc-950/98 border border-white/[0.08] rounded-xl py-2 min-w-[260px] shadow-2xl backdrop-blur-xl"
                        >
                          {featureItems.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.link}
                              onClick={() => setShowFeatures(false)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:bg-white/[0.06] transition-all"
                            >
                              {item.icon && <span>{item.icon}</span>}
                              <span>{item.name}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0">{userMenu || authButtons}</div>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="md:hidden text-neutral-200 hover:text-white p-2.5 rounded-xl hover:bg-white/[0.08]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.nav>
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.18 }}
            className="md:hidden fixed top-20 inset-x-0 mx-auto z-[4999] w-[min(1180px,calc(100%-1rem))] border border-white/[0.08] rounded-2xl bg-zinc-950/96 backdrop-blur-xl shadow-[0_14px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    location.pathname === item.link
                      ? "text-white bg-white/[0.1]"
                      : "text-neutral-300 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.name}</span>
                </Link>
              ))}

              {featureItems && featureItems.length > 0 && (
                <div className="pt-2">
                  <div className="px-3 pb-1 text-xs uppercase tracking-wider text-neutral-500">Features</div>
                  <div className="grid grid-cols-2 gap-1">
                    {featureItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-[13px] text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                      >
                        {item.icon && <span className="w-3.5 h-3.5">{item.icon}</span>}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 mt-3 border-t border-white/[0.08]">{userMenu || authButtons}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer so content isn't hidden behind the fixed nav */}
      <div className="h-20" />
    </>
  );
};
