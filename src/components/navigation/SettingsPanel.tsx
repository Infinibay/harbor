import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface SettingsPanelItem {
  id: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

export interface SettingsPanelSection {
  id?: string;
  label: string;
  items: SettingsPanelItem[];
}

export interface SettingsPanelProps {
  sections: SettingsPanelSection[];
  value?: string;
  onChange?: (id: string) => void;
  header?: ReactNode;
  className?: string;
}

/** Two-pane-style left panel for settings / preferences.
 *
 * Groups items under labeled sections. Items have icon + label +
 * optional description. Pair with a right-side content pane that reacts
 * to `value`. */
export function SettingsPanel({
  sections,
  value,
  onChange,
  header,
  className,
}: SettingsPanelProps) {
  const [internal, setInternal] = useState(sections[0]?.items[0]?.id);
  const current = value ?? internal;

  return (
    <aside
      className={cn(
        "w-64 h-full flex flex-col rounded-2xl bg-white/[0.02] border border-white/8 overflow-hidden",
        className,
      )}
    >
      {header ? (
        <div className="px-4 py-3 border-b border-white/5">{header}</div>
      ) : null}
      <div className="flex-1 overflow-y-auto px-2 py-3 flex flex-col gap-4">
        {sections.map((s) => (
          <div key={s.id ?? s.label}>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/35 px-2 mb-1.5">
              {s.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {s.items.map((it) => {
                const active = current === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      setInternal(it.id);
                      onChange?.(it.id);
                    }}
                    data-cursor="button"
                    className={cn(
                      "w-full text-left px-2.5 py-2 rounded-lg flex items-start gap-2.5 transition-colors",
                      active
                        ? "bg-fuchsia-500/15 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {it.icon ? (
                      <span className="mt-0.5 shrink-0">{it.icon}</span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm truncate">{it.label}</span>
                      {it.description ? (
                        <span className="block text-xs text-white/40 truncate">
                          {it.description}
                        </span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
