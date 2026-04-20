import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CursorProvider } from "./lib/cursor";
import { IconButton, ToastProvider } from "./components";
import { routeGroups } from "./routes";
import { Z } from "./lib/z";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

type Theme = "dark" | "light";

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = window.localStorage.getItem("harbor-theme");
    return stored === "light" ? "light" : "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    window.localStorage.setItem("harbor-theme", theme);
  }, [theme]);

  const next: Theme = theme === "light" ? "dark" : "light";
  return (
    <div
      style={{ position: "fixed", top: 16, right: 16, zIndex: Z.STICKY + 1 }}
    >
      <IconButton
        size="md"
        variant="glass"
        reactive={false}
        label={`Switch to ${next} theme`}
        icon={theme === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={() => setTheme(next)}
      />
    </div>
  );
}

export function Layout() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <CursorProvider>
      <ToastProvider>
        <ThemeToggle />
        <div className="min-h-screen">
          <div
            aria-hidden
            className="mesh-bg"
            style={{
              background: `
                radial-gradient(50vmin at 85% 75%, color-mix(in oklch, #38bdf8 22%, transparent) 0%, transparent 55%),
                radial-gradient(60vmin at 15% 90%, color-mix(in oklch, #f472b6 18%, transparent) 0%, transparent 55%),
                radial-gradient(55vmin at 30% 20%, color-mix(in oklch, #a855f7 22%, transparent) 0%, transparent 60%),
                #0a0a0f
              `,
            }}
          >
            <motion.div
              className="blob"
              animate={{
                x: ["0%", "15%", "-5%", "0%"],
                y: ["0%", "10%", "-10%", "0%"],
              }}
              transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 420,
                height: 420,
                background: "radial-gradient(circle, #a855f7, transparent 70%)",
                top: "-10%",
                left: "-5%",
              }}
            />
            <motion.div
              className="blob"
              animate={{
                x: ["0%", "-10%", "8%", "0%"],
                y: ["0%", "-8%", "6%", "0%"],
              }}
              transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 500,
                height: 500,
                background: "radial-gradient(circle, #38bdf8, transparent 70%)",
                bottom: "-15%",
                right: "-10%",
              }}
            />
          </div>

          <motion.div
            style={{ scaleX: progress, transformOrigin: "0 0", zIndex: Z.CHROME }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400"
          />

          <div className="flex relative">
            <aside className="hidden lg:flex sticky top-0 h-screen w-64 flex-col px-6 py-8 gap-5 overflow-y-auto">
              <NavLink
                to="/"
                className="block"
                data-cursor="button"
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Infinibay
                </div>
                <div className="text-white font-semibold text-lg tracking-tight">
                  Living UI Library
                </div>
              </NavLink>

              {routeGroups.map((group) => (
                <div key={group.id} className="flex flex-col gap-0.5">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-fuchsia-300/60 mb-1.5 px-1">
                    {group.label}
                  </div>
                  {group.routes.map((r) => (
                    <NavLink
                      key={r.path}
                      to={r.path}
                      data-cursor="button"
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 py-1.5 px-1 text-sm rounded-md ${
                          isActive
                            ? "text-white"
                            : "text-white/55 hover:text-white/80"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className="h-px transition-all"
                            style={{
                              width: isActive ? 24 : 10,
                              background: isActive
                                ? "linear-gradient(90deg,#a855f7,#38bdf8)"
                                : "rgba(255,255,255,0.3)",
                            }}
                          />
                          {r.label}
                        </>
                      )}
                    </NavLink>
                  ))}
                </div>
              ))}

              <div className="mt-4 text-xs text-white/40 leading-relaxed max-w-[200px]">
                Tocá todo. Decime qué te gusta.
              </div>
            </aside>

            <main className="flex-1 min-w-0 px-8 md:px-14 max-w-6xl mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </ToastProvider>
    </CursorProvider>
  );
}
