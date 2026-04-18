import { useState } from "react";
import { cn } from "../../lib/cn";

export interface Reaction {
  emoji: string;
  count: number;
  mine?: boolean;
}

export interface ReactionsBarProps {
  reactions: Reaction[];
  onToggle: (emoji: string) => void;
  quickEmojis?: string[];
  className?: string;
}

const defaultQuick = ["👍", "❤️", "🎉", "🚀", "👀", "🤔", "🔥", "😂"];

export function ReactionsBar({
  reactions,
  onToggle,
  quickEmojis = defaultQuick,
  className,
}: ReactionsBarProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className={cn("inline-flex items-center gap-1 flex-wrap", className)}>
      {reactions.map((r) => (
        <button
          key={r.emoji}
          onClick={() => onToggle(r.emoji)}
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-sm border transition-colors",
            r.mine
              ? "bg-fuchsia-500/15 border-fuchsia-400/40 text-white"
              : "bg-white/5 border-white/10 text-white/75 hover:bg-white/10",
          )}
        >
          <span>{r.emoji}</span>
          <span className="font-mono tabular-nums text-xs">{r.count}</span>
        </button>
      ))}
      <div className="relative">
        <button
          onClick={() => setPickerOpen((o) => !o)}
          className="w-7 h-7 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/50 hover:text-white/85 text-sm grid place-items-center"
          aria-label="Add reaction"
        >
          + 😀
        </button>
        {pickerOpen ? (
          <>
            <div
              className="fixed inset-0"
              onClick={() => setPickerOpen(false)}
            />
            <div className="absolute bottom-full left-0 mb-2 rounded-xl bg-[#14141c] border border-white/10 p-2 shadow-xl flex gap-1 z-10">
              {quickEmojis.map((em) => (
                <button
                  key={em}
                  onClick={() => {
                    onToggle(em);
                    setPickerOpen(false);
                  }}
                  className="w-8 h-8 grid place-items-center text-lg rounded hover:bg-white/10"
                >
                  {em}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
