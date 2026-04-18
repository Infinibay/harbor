import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ColorSwatchProps {
  colors: string[];
  value?: string;
  onChange?: (c: string) => void;
  label?: string;
  className?: string;
}

export function ColorSwatch({
  colors,
  value,
  onChange,
  label,
  className,
}: ColorSwatchProps) {
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label className="block text-xs text-white/60 mb-2">{label}</label>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <motion.button
            key={c}
            type="button"
            onClick={() => onChange?.(c)}
            data-cursor="button"
            data-cursor-label={c}
            whileHover={{ scale: 1.12, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className={cn(
              "w-9 h-9 rounded-full relative outline-none ring-offset-2 ring-offset-[#12121a]",
              value === c ? "ring-2 ring-white" : "ring-1 ring-white/15",
            )}
            style={{ background: c }}
          >
            {value === c ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 grid place-items-center text-white font-bold text-xs"
                style={{ textShadow: "0 0 6px rgba(0,0,0,0.6)" }}
              >
                ✓
              </motion.span>
            ) : null}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
