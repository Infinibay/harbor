import {
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/cn";

export interface ChatInputProps {
  onSend?: (text: string) => void;
  placeholder?: string;
  className?: string;
  actions?: ReactNode;
}

export function ChatInput({
  onSend,
  placeholder = "Type a message…",
  className,
  actions,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement | null>(null);

  function send() {
    const v = text.trim();
    if (!v) return;
    onSend?.(v);
    setText("");
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function grow() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  return (
    <motion.div
      layout
      className={cn(
        "flex items-end gap-2 p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-fuchsia-400/60 transition-colors",
        className,
      )}
    >
      {actions}
      <textarea
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          grow();
        }}
        onKeyDown={onKey}
        placeholder={placeholder}
        className="flex-1 resize-none bg-transparent outline-none text-sm text-white placeholder:text-white/30 py-1.5 px-1 min-h-[24px] max-h-40"
      />
      <AnimatePresence>
        {text.trim().length > 0 ? (
          <motion.button
            key="send"
            layout
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            whileTap={{ scale: 0.88 }}
            onClick={send}
            className="w-8 h-8 rounded-full grid place-items-center text-black shrink-0"
            style={{
              background: "linear-gradient(135deg,#a855f7,#38bdf8)",
            }}
            aria-label="Send"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </motion.button>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
