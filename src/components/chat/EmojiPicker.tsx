import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

const SET = {
  Smileys: ["😀", "😁", "😂", "🤣", "😊", "😇", "🥰", "😍", "🤩", "😎", "🥳", "🤔", "🙃", "😴", "😭"],
  Gestures: ["👍", "👎", "👏", "🙌", "👋", "🤝", "💪", "🙏", "🫶", "🤌", "👊"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🩷", "💖", "💔"],
  Nature: ["🔥", "✨", "⚡", "🌟", "💥", "🎉", "🌈", "☀️", "🌙", "❄️"],
  Tech: ["💻", "📱", "🖥️", "⌨️", "🖱️", "🚀", "🛰️", "🤖", "🧠", "⚙️"],
} as const;

type Category = keyof typeof SET;

export interface EmojiPickerProps {
  onPick: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ onPick, className }: EmojiPickerProps) {
  const [cat, setCat] = useState<Category>("Smileys");
  const [q, setQ] = useState("");
  const categories = useMemo(() => Object.keys(SET) as Category[], []);
  const emojis = q
    ? Object.values(SET).flat()
    : SET[cat];

  return (
    <div
      className={cn(
        "w-64 rounded-2xl bg-[#14141c] border border-white/10 shadow-2xl overflow-hidden",
        className,
      )}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search…"
        className="w-full px-3 py-2 text-sm bg-transparent text-white outline-none border-b border-white/8 placeholder:text-white/30"
      />
      {!q ? (
        <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-white/8 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-2 py-1 text-xs rounded-md whitespace-nowrap transition-colors",
                cat === c
                  ? "bg-white/10 text-white"
                  : "text-white/55 hover:text-white/80",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}
      <div className="p-2 max-h-56 overflow-auto">
        <div className="grid grid-cols-7 gap-0.5">
          {emojis.map((e, i) => (
            <motion.button
              key={e + i}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => onPick(e)}
              className="aspect-square grid place-items-center rounded-md hover:bg-white/5 text-lg"
            >
              {e}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
