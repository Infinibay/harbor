import { AppShell } from "./AppShell";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function Sidebar() {
  const items = ["Overview", "VMs", "Templates", "Networks", "Settings"];
  return (
    <aside className="w-48 shrink-0 border-r border-white/8 bg-white/[0.02] p-3 flex flex-col gap-1">
      <div className="px-2 py-1.5 text-xs uppercase tracking-widest text-white/40">
        Infinibay
      </div>
      {items.map((it, i) => (
        <button
          key={it}
          className={
            "px-2 py-1.5 rounded-md text-sm text-left " +
            (i === 0
              ? "bg-white/10 text-white"
              : "text-white/65 hover:bg-white/5 hover:text-white")
          }
        >
          {it}
        </button>
      ))}
    </aside>
  );
}

function Header() {
  return (
    <header className="h-12 border-b border-white/8 px-4 flex items-center justify-between bg-white/[0.02]">
      <div className="text-sm text-white/80">Overview</div>
      <div className="text-xs text-white/40">andres@infinibay</div>
    </header>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AppShellDemo(props: any) {
  return (
    <div style={{ height: 520, width: "100%", overflow: "hidden", borderRadius: 12 }}>
      <AppShell {...props} sidebar={<Sidebar />} header={<Header />}>
        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/80">
            Main content area — scrolls internally when{" "}
            <code className="text-white/70">gutter</code> is set.
          </div>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white/65"
            >
              Row {i + 1}
            </div>
          ))}
        </div>
      </AppShell>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: AppShellDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    contentPadding: {
      type: "select",
      options: ["none", "sm", "md", "lg"],
      default: "lg",
    },
    gutter: {
      type: "select",
      options: ["none", "sm", "md", "lg"],
      default: "none",
    },
  },
  variants: [
    { label: "Edge-to-edge (no gutter)", props: { gutter: "none" } },
    { label: "Floating islands (md gutter)", props: { gutter: "md" } },
    { label: "Compact padding", props: { contentPadding: "sm", gutter: "sm" } },
  ],
  events: [],
  notes:
    "Demo is wrapped in a 520px-tall container so the shell doesn't take over the playground frame.",
};
