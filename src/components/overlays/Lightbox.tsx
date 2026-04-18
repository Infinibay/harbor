import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "../../lib/Portal";
import { Z } from "../../lib/z";

export interface LightboxImage {
  id: string;
  src: string;
  alt?: string;
  caption?: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({
  images,
  index,
  onIndexChange,
  open,
  onClose,
}: LightboxProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onIndexChange(Math.max(0, index - 1));
      else if (e.key === "ArrowRight") onIndexChange(Math.min(images.length - 1, index + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onIndexChange, onClose]);

  const img = images[index];

  return (
    <Portal>
      <AnimatePresence>
        {open && img ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              zIndex: Z.DIALOG,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
            className="fixed inset-0 bg-black/80 flex flex-col"
            onClick={onClose}
          >
            <div className="flex-1 grid place-items-center p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.img
                  key={img.id}
                  src={img.src}
                  alt={img.alt ?? ""}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-w-full max-h-full rounded-lg shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
                />
              </AnimatePresence>

              {index > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange(index - 1);
                  }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center text-xl"
                  aria-label="Previous"
                >
                  ‹
                </button>
              ) : null}
              {index < images.length - 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndexChange(index + 1);
                  }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center text-xl"
                  aria-label="Next"
                >
                  ›
                </button>
              ) : null}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {img.caption ? (
              <div className="px-6 py-3 text-center text-sm text-white/75">
                {img.caption}
              </div>
            ) : null}

            <div className="px-6 pb-6 flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
              {images.map((im, i) => (
                <button
                  key={im.id}
                  onClick={() => onIndexChange(i)}
                  className="w-12 h-12 rounded overflow-hidden border-2"
                  style={{
                    borderColor: i === index ? "#a855f7" : "rgba(255,255,255,0.1)",
                  }}
                >
                  <img src={im.src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
