import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { CursorProvider } from "./lib/cursor";
import { ToastProvider } from "./components";
import { routeGroups } from "./routes";
import { Z } from "./lib/z";

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
