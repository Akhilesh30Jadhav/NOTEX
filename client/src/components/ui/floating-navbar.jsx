import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const FloatingNav = ({
  navItems,
  featureItems,
  authButtons,
  userMenu,
  logo,
  className,
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current - (scrollYProgress.getPrevious() ?? 0);
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        setVisible(direction < 0);
      }
    }
  });

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ opacity: 1, y: -100 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "fixed top-4 inset-x-0 mx-auto z-[5000] max-w-5xl",
            "border border-white/[0.08] rounded-2xl",
            "bg-zinc-950/80 backdrop-blur-xl",
            "shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]",
            "px-4 md:px-6 py-2.5",
            className
          )}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            {logo}

            {/* Desktop Nav Items */}
            {!isMobile && (
              <div className="flex items-center gap-1">
                {navItems.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.link}
                    className="relative flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
                  >
                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                ))}

                {/* Features Dropdown */}
                {featureItems && featureItems.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowFeatures(true)}
                    onMouseLeave={() => setShowFeatures(false)}
                  >
                    <button className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/[0.05]">
                      Features
                      <svg className="w-3 h-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <AnimatePresence>
                      {showFeatures && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-zinc-950/98 border border-white/[0.08] rounded-xl py-2 min-w-[200px] shadow-2xl backdrop-blur-xl"
                        >
                          {featureItems.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.link}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/[0.05] transition-all"
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
            )}

            {/* Right side: auth/user + mobile toggle */}
            <div className="flex items-center gap-2">
              {!isMobile && (userMenu || authButtons)}

              {/* Mobile toggle */}
              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-neutral-300 hover:text-white p-1.5"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobile && isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/[0.06] mt-2.5"
              >
                <div className="flex flex-col py-3 gap-0.5">
                  {navItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-neutral-300 hover:text-white hover:bg-white/[0.05] px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                      {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  {featureItems && (
                    <>
                      <div className="px-3 pt-2 pb-1 text-xs text-neutral-500 font-semibold uppercase tracking-wider">
                        Features
                      </div>
                      {featureItems.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.link}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/[0.05] px-3 py-2 rounded-lg text-sm transition-all"
                        >
                          {item.icon && <span>{item.icon}</span>}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </>
                  )}

                  <div className="border-t border-white/[0.06] mt-2 pt-2">
                    {userMenu || authButtons}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </AnimatePresence>

      {/* Spacer so content isn't hidden behind the fixed nav */}
      <div className="h-20" />
    </>
  );
};
