import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/cn";

const AccordionCtx = createContext<{
  value: string[];
  toggle: (v: string) => void;
  multiple: boolean;
} | null>(null);

export interface AccordionProps {
  defaultValue?: string | string[];
  multiple?: boolean;
  children: ReactNode;
  className?: string;
}

export function Accordion({
  defaultValue,
  multiple = false,
  children,
  className,
}: AccordionProps) {
  const [value, setValue] = useState<string[]>(
    defaultValue
      ? Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      : [],
  );
  function toggle(v: string) {
    setValue((cur) =>
      cur.includes(v)
        ? cur.filter((x) => x !== v)
        : multiple
          ? [...cur, v]
          : [v],
    );
  }
  return (
    <AccordionCtx.Provider value={{ value, toggle, multiple }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionCtx.Provider>
  );
}

export interface AccordionItemProps {
  value: string;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
}

export function AccordionItem({
  value,
  title,
  icon,
  children,
}: AccordionItemProps) {
  const ctx = useContext(AccordionCtx);
  if (!ctx) throw new Error();
  const open = ctx.value.includes(value);
  return (
    <div className="rounded-xl border border-white/8 overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => ctx.toggle(value)}
        data-cursor="button"
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/[0.03] transition-colors"
      >
        {icon ? <span className="text-white/60">{icon}</span> : null}
        <span className="flex-1 text-white font-medium text-sm">{title}</span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/50"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm text-white/70">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
