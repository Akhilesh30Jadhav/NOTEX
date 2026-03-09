import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

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
  const location = useLocation();
  const featuresTimeout = useRef(null);

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

  const handleFeaturesEnter = () => {
    clearTimeout(featuresTimeout.current);
    setShowFeatures(true);
  };

  const handleFeaturesLeave = () => {
    featuresTimeout.current = setTimeout(() => setShowFeatures(false), 150);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.nav
          initial={{ opacity: 1, y: -100 }}
          animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn(
            "fixed top-5 inset-x-0 mx-auto z-[5000]",
            "w-[calc(100%-2rem)] max-w-6xl",
            "rounded-full",
            "bg-black/60 backdrop-blur-2xl",
            "border border-white/[0.08]",
            "shadow-[0_0_30px_rgba(99,102,241,0.08),0_0_0_1px_rgba(255,255,255,0.05)]",
            "px-6 lg:px-8 py-3",
            className
          )}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="shrink-0">{logo}</div>

            {/* Desktop Center Nav */}
            {!isMobile && (
              <div className="flex items-center justify-center gap-0.5">
                {navItems.map((item, idx) => {
                  const isActive = location.pathname === item.link;
                  return (
                    <Link
                      key={idx}
                      to={item.link}
                      className={cn(
                        "relative text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-200",
                        isActive
                          ? "text-white bg-white/[0.1]"
                          : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-x-3 -bottom-px h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}

                {/* Features Dropdown */}
                {featureItems && featureItems.length > 0 && (
                  <div
                    className="relative"
                    onMouseEnter={handleFeaturesEnter}
                    onMouseLeave={handleFeaturesLeave}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-200",
                        showFeatures
                          ? "text-white bg-white/[0.1]"
                          : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      Features
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform duration-200",
                          showFeatures && "rotate-180"
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {showFeatures && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          onMouseEnter={handleFeaturesEnter}
                          onMouseLeave={handleFeaturesLeave}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-zinc-950/95 border border-white/[0.08] rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                        >
                          <div className="grid grid-cols-2 gap-0.5">
                            {featureItems.map((item, idx) => (
                              <Link
                                key={idx}
                                to={item.link}
                                onClick={() => setShowFeatures(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 group"
                              >
                                <span className="text-neutral-500 group-hover:text-indigo-400 transition-colors shrink-0">
                                  {item.icon}
                                </span>
                                <span className="text-[13px] font-medium">{item.name}</span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {/* Right Side */}
            <div className="shrink-0 flex items-center">
              {!isMobile && (userMenu || authButtons)}

              {isMobile && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-neutral-300 hover:text-white p-2 rounded-full hover:bg-white/[0.06] transition-colors"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              )}
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Slide-Down Menu (outside nav pill) */}
      <AnimatePresence>
        {isMobile && isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-20 inset-x-0 mx-auto z-[4999] w-[calc(100%-2rem)] max-w-6xl bg-zinc-950/95 border border-white/[0.08] rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    location.pathname === item.link
                      ? "text-white bg-white/[0.08]"
                      : "text-neutral-300 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  <span className="text-neutral-500">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}

              {featureItems && (
                <>
                  <div className="px-4 pt-3 pb-1 text-[11px] text-neutral-500 font-semibold uppercase tracking-widest">
                    Features
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {featureItems.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.link}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/[0.05] px-3 py-2.5 rounded-xl text-[13px] transition-all"
                      >
                        <span className="text-neutral-500 shrink-0">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <div className="border-t border-white/[0.06] mt-3 pt-3">
                {userMenu || authButtons}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-24" />
    </>
  );
};
