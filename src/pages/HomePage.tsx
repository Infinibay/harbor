import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { routeGroups } from "../routes";

export function HomePage() {
  return (
    <div className="pb-24">
      <section className="min-h-[60vh] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Component library · reactive to cursor
          </div>
          <h1
            className="text-4xl md:text-6xl font-semibold tracking-tight"
            style={{
              background:
                "linear-gradient(180deg, #fff 0%, color-mix(in oklch, #fff 55%, transparent) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cada componente,
            <br />
            <em
              className="not-italic"
              style={{
                background:
                  "linear-gradient(135deg, #a855f7, #38bdf8, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              vivo.
            </em>
          </h1>
          <p className="mt-4 text-white/60 max-w-xl">
            Una librería gigante, organizada por el tipo de app que estás
            construyendo. Elegí una categoría del sidebar y decime cuáles
            componentes querés que iteremos.
          </p>
        </motion.div>
      </section>

      {routeGroups.map((g) => (
        <section key={g.id} className="py-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-fuchsia-300/70 mb-2">
            <span className="h-px w-8 bg-fuchsia-300/50" />
            {g.label}
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {g.routes.map((r) => (
              <Link
                key={r.path}
                to={r.path}
                data-cursor="button"
                className="glass spotlight rounded-xl border border-white/10 p-4 text-white/85 hover:border-white/25 transition-colors"
              >
                <div className="text-sm font-medium">{r.label}</div>
                <div className="text-xs text-white/40 mt-1 font-mono">
                  {r.path}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="py-16 text-center text-white/40 text-sm">
        decime cuáles te gustan y cuáles no.
      </footer>
    </div>
  );
}
