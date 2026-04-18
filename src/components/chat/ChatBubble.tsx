import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ChatBubbleProps {
  from: "me" | "them";
  author?: string;
  avatar?: ReactNode;
  time?: string;
  children: ReactNode;
  status?: "sending" | "sent" | "delivered" | "read";
  reactions?: { emoji: string; count: number }[];
  className?: string;
}

export function ChatBubble({
  from,
  author,
  avatar,
  time,
  status,
  reactions,
  children,
  className,
}: ChatBubbleProps) {
  const me = from === "me";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn(
        "flex items-end gap-2 max-w-[80%]",
        me ? "ml-auto flex-row-reverse" : "",
        className,
      )}
    >
      {avatar ? (
        <div className="pb-1 shrink-0">{avatar}</div>
      ) : null}
      <div className={cn("flex flex-col", me ? "items-end" : "items-start")}>
        {author ? (
          <div className="text-[11px] text-white/45 mb-1 px-2">{author}</div>
        ) : null}
        <div
          className={cn(
            "relative px-3.5 py-2 text-sm leading-snug shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]",
            me
              ? "rounded-2xl rounded-br-md bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white"
              : "rounded-2xl rounded-bl-md bg-white/8 border border-white/10 text-white",
          )}
        >
          {children}
          {reactions && reactions.length > 0 ? (
            <div
              className={cn(
                "absolute -bottom-2 flex gap-0.5",
                me ? "right-2" : "left-2",
              )}
            >
              {reactions.map((r, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                    delay: i * 0.04,
                  }}
                  className="inline-flex items-center gap-0.5 bg-[#14141c] border border-white/10 rounded-full px-1.5 py-0.5 text-[10px] text-white"
                >
                  <span>{r.emoji}</span>
                  <span className="text-white/70">{r.count}</span>
                </motion.span>
              ))}
            </div>
          ) : null}
        </div>
        {(time || status) && (
          <div
            className={cn(
              "text-[10px] text-white/40 mt-1 px-2 inline-flex items-center gap-1",
              me ? "flex-row-reverse" : "",
            )}
          >
            {time}
            {status === "sending" ? (
              <span className="inline-block w-2 h-2 rounded-full border border-white/40 border-t-transparent animate-spin" />
            ) : status === "sent" ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
            ) : status === "delivered" ? (
              <svg width="14" height="10" viewBox="0 0 28 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 6l4 4L14 2M12 10L22 2" />
              </svg>
            ) : status === "read" ? (
              <svg width="14" height="10" viewBox="0 0 28 12" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round">
                <path d="M2 6l4 4L14 2M12 10L22 2" />
              </svg>
            ) : null}
          </div>
        )}
      </div>
    </motion.div>
  );
}
