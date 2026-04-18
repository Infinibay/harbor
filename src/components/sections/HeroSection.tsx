import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface HeroSectionProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  highlight?: ReactNode;
  description?: ReactNode;
  primaryCta?: ReactNode;
  secondaryCta?: ReactNode;
  media?: ReactNode;
  layout?: "centered" | "split";
  className?: string;
}

export function HeroSection({
  eyebrow,
  title,
  highlight,
  description,
  primaryCta,
  secondaryCta,
  media,
  layout = "centered",
  className,
}: HeroSectionProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={layout === "centered" ? "text-center max-w-3xl mx-auto" : "max-w-xl"}
    >
      {eyebrow ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/70 mb-5",
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {eyebrow}
        </div>
      ) : null}
      <h1
        className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, color-mix(in oklch, #fff 60%, transparent) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
        {highlight ? (
          <>
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
              {highlight}
            </em>
          </>
        ) : null}
      </h1>
      {description ? (
        <p
          className={cn(
            "mt-5 text-white/65 text-lg leading-relaxed",
            layout === "centered" && "mx-auto max-w-xl",
          )}
        >
          {description}
        </p>
      ) : null}
      {(primaryCta || secondaryCta) && (
        <div
          className={cn(
            "mt-7 flex flex-wrap gap-3",
            layout === "centered" && "justify-center",
          )}
        >
          {primaryCta}
          {secondaryCta}
        </div>
      )}
    </motion.div>
  );

  if (layout === "split") {
    return (
      <section
        className={cn(
          "py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center",
          className,
        )}
      >
        {content}
        {media ? (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            {media}
          </motion.div>
        ) : null}
      </section>
    );
  }

  return (
    <section className={cn("py-16 md:py-24", className)}>
      {content}
      {media ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          {media}
        </motion.div>
      ) : null}
    </section>
  );
}
