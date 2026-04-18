import { useId, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { Z } from "../../lib/z";

export interface NavItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
}

export interface NavBarProps {
  items: NavItem[];
  brand?: ReactNode;
  right?: ReactNode;
  value?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function NavBar({
  items,
  brand,
  right,
  value,
  onChange,
  className,
}: NavBarProps) {
  const layoutId = useId();
  const [internal, setInternal] = useState(items[0]?.id);
  const current = value ?? internal;

  return (
    <header
      style={{ zIndex: Z.STICKY }}
      className={cn(
        "sticky top-0 flex items-center gap-6 px-4 h-14 rounded-2xl glass",
        className,
      )}
    >
      {brand ? (
        <div className="text-white font-semibold text-sm tracking-tight">
          {brand}
        </div>
      ) : null}
      <nav className="flex items-center gap-1 flex-1">
        {items.map((it) => {
          const active = it.id === current;
          return (
            <motion.a
              key={it.id}
              href={it.href}
              onClick={(e) => {
                if (!it.href) e.preventDefault();
                if (value === undefined) setInternal(it.id);
                onChange?.(it.id);
              }}
              data-cursor="button"
              whileHover={{ y: -1 }}
              className={cn(
                "relative px-3 py-1.5 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors",
                active ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={`${layoutId}-nav`}
                  className="absolute inset-0 rounded-lg bg-white/8 border border-white/10"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              ) : null}
              <span className="relative inline-flex items-center gap-2">
                {it.icon}
                {it.label}
              </span>
            </motion.a>
          );
        })}
      </nav>
      {right}
    </header>
  );
}
