import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface CarouselSlide {
  id: string;
  content: ReactNode;
}

export interface CarouselProps {
  slides: CarouselSlide[];
  initial?: number;
  className?: string;
  showDots?: boolean;
  showArrows?: boolean;
  aspect?: "video" | "square" | "wide";
}

const aspects = {
  video: "aspect-video",
  square: "aspect-square",
  wide: "aspect-[21/9]",
};

export function Carousel({
  slides,
  initial = 0,
  className,
  showDots = true,
  showArrows = true,
  aspect = "video",
}: CarouselProps) {
  const [idx, setIdx] = useState(initial);
  const [dir, setDir] = useState(0);

  function go(n: number) {
    const next = (n + slides.length) % slides.length;
    setDir(next > idx ? 1 : -1);
    setIdx(next);
  }

  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-white/10 bg-black/50",
        aspects[aspect],
        className,
      )}
    >
      <AnimatePresence custom={dir} initial={false} mode="popLayout">
        <motion.div
          key={slides[idx].id}
          custom={dir}
          initial={{ opacity: 0, x: dir > 0 ? 80 : -80, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: dir > 0 ? -80 : 80, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.25}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) go(idx + 1);
            else if (info.offset.x > 60) go(idx - 1);
          }}
        >
          {slides[idx].content}
        </motion.div>
      </AnimatePresence>

      {showArrows ? (
        <>
          <button
            onClick={() => go(idx - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass grid place-items-center text-white hover:bg-white/15"
          >
            ‹
          </button>
          <button
            onClick={() => go(idx + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass grid place-items-center text-white hover:bg-white/15"
          >
            ›
          </button>
        </>
      ) : null}
      {showDots ? (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setDir(i > idx ? 1 : -1);
                setIdx(i);
              }}
              className="group py-2"
            >
              <motion.span
                animate={{
                  width: i === idx ? 24 : 6,
                  opacity: i === idx ? 1 : 0.5,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="block h-1.5 rounded-full bg-white"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
