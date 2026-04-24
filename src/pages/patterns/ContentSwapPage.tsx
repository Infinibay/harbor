import { useState } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import { ContentSwap, type ContentSwapVariant } from "../../components/motion/ContentSwap";
import { Button } from "../../components/buttons/Button";

/**
 * Showcase for ContentSwap — the transition primitive every app reaches
 * for sooner or later: a way to swap a piece of content without it
 * feeling like a hard repaint. Drop it around anything that changes on
 * a discriminator (route, tab, wizard step, drawer view) and pick a
 * variant that matches the mental model of the change.
 */
export function ContentSwapPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-fuchsia-300/70 mb-2">
          patterns · content swap
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          ContentSwap
        </h1>
        <p className="mt-2 text-white/55 max-w-3xl">
          Generic animated transition for content that gets replaced when
          an `id` changes. Framework-agnostic — pass the pathname from
          your router, the active tab id, the current wizard step, or
          whatever identifies &quot;the thing currently on screen&quot;.
          Ships with named variants and respects{" "}
          <code className="font-mono text-fuchsia-200/80">
            prefers-reduced-motion
          </code>
          .
        </p>
      </header>

      <Group
        id="variants"
        title="Variants"
        desc="Click the buttons to cycle through three demo panels. Each demo uses a different variant so you can feel the difference."
      >
        <Demo title="fade · default" intensity="soft">
          <VariantDemo variant="fade" />
        </Demo>
        <Demo title="fade-up" intensity="soft">
          <VariantDemo variant="fade-up" />
        </Demo>
        <Demo title="fade-down" intensity="soft">
          <VariantDemo variant="fade-down" />
        </Demo>
        <Demo title="scale" intensity="soft">
          <VariantDemo variant="scale" />
        </Demo>
        <Demo title="blur" intensity="soft">
          <VariantDemo variant="blur" />
        </Demo>
        <Demo title="slide-left" intensity="soft">
          <VariantDemo variant="slide-left" />
        </Demo>
        <Demo title="slide-right" intensity="soft">
          <VariantDemo variant="slide-right" />
        </Demo>
        <Demo title="none · instant (reduced-motion fallback)" intensity="soft">
          <VariantDemo variant="none" />
        </Demo>
      </Group>

      <Group
        id="route"
        title="Route transition"
        desc="The primary use case: wrap your router outlet. Sidebar and header live outside the wrapper so they stay pinned — only the content dissolves."
      >
        <Demo title="Sequential fade (mode='wait')" intensity="strong">
          <RouteFakeDemo mode="wait" />
        </Demo>
        <Demo title="Overlap (mode='sync')" intensity="strong">
          <RouteFakeDemo mode="sync" />
        </Demo>
      </Group>

      <Group
        id="tabs"
        title="Tab content"
        desc="Perfect for tab panels where the content is meaningfully different. Avoid over-animating on tabs whose content is just a filter of the same list — a crossfade there reads as jitter."
      >
        <Demo title="Tab body · fade-up" intensity="soft">
          <TabsDemo />
        </Demo>
      </Group>

      <Group
        id="wizard"
        title="Wizard steps"
        desc="Horizontal slides pair with forward/back semantics. Note how slide-left feels like 'next' and slide-right feels like 'back'."
      >
        <Demo title="Wizard · direction-aware slides" intensity="soft">
          <WizardDemo />
        </Demo>
      </Group>

      <Group
        id="api"
        title="API"
        desc="The full surface. Swap variants, durations and modes to suit the UI."
      >
        <Demo title="Usage" intensity="soft">
          <pre className="p-4 text-xs text-white/75 font-mono whitespace-pre-wrap leading-relaxed">
{`import { ContentSwap } from "@harbor/ui";

<ContentSwap id={pathname} variant="fade" mode="wait" duration={160}>
  {children}
</ContentSwap>

// Variants:   fade · fade-up · fade-down · scale · blur
//             slide-left · slide-right · none
// Modes:      wait (old exits, then new mounts) · sync (overlap)
// Motion:     respects prefers-reduced-motion by default
// Escape:     pass customVariants={...} for custom Framer variants`}
          </pre>
        </Demo>
      </Group>
    </div>
  );
}

/* ───────────────────── Demos ───────────────────── */

const PANELS: Array<{ id: string; title: string; body: string; tint: string }> = [
  {
    id: "a",
    title: "First panel",
    body: "The quick brown fox jumps over the lazy dog. Notice how the text arrives coherently — no text-jerk, no line-shift, no blank frame.",
    tint: "rgb(168 85 247 / 0.10)",
  },
  {
    id: "b",
    title: "Second panel",
    body: "Pack my box with five dozen liquor jugs. Variants modulate the feel of the swap without changing what the content is.",
    tint: "rgb(56 189 248 / 0.10)",
  },
  {
    id: "c",
    title: "Third panel",
    body: "How vexingly quick daft zebras jump. Reach for ContentSwap any time the reader's eye needs a beat to register that something changed.",
    tint: "rgb(244 114 182 / 0.10)",
  },
];

function VariantDemo({ variant }: { variant: ContentSwapVariant }) {
  const [i, setI] = useState(0);
  const p = PANELS[i];
  const go = (dir: 1 | -1) =>
    setI((n) => (n + dir + PANELS.length) % PANELS.length);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => go(-1)}>
          Prev
        </Button>
        <Button size="sm" variant="secondary" onClick={() => go(1)}>
          Next
        </Button>
        <span className="ml-auto text-xs text-white/50">
          panel {i + 1} / {PANELS.length}
        </span>
      </div>
      <div
        className="relative rounded-xl border border-white/10 overflow-hidden"
        style={{ background: p.tint, minHeight: 140 }}
      >
        <ContentSwap id={p.id} variant={variant} duration={180}>
          <div className="p-5">
            <div className="text-sm font-medium text-white/90 mb-1.5">
              {p.title}
            </div>
            <div className="text-sm text-white/70 leading-relaxed max-w-md">
              {p.body}
            </div>
          </div>
        </ContentSwap>
      </div>
    </div>
  );
}

function RouteFakeDemo({ mode }: { mode: "wait" | "sync" }) {
  const routes = ["/dashboard", "/users", "/settings", "/billing"];
  const [path, setPath] = useState(routes[0]);
  return (
    <div className="flex gap-3 h-[240px] rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
      {/* Fake sidebar — stays pinned across "navigation" */}
      <nav className="w-44 p-2 border-r border-white/8 flex flex-col gap-0.5">
        {routes.map((r) => {
          const active = r === path;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setPath(r)}
              className={
                "text-left px-3 py-1.5 rounded-md text-xs transition-colors " +
                (active
                  ? "bg-white/8 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90")
              }
            >
              {r}
            </button>
          );
        })}
      </nav>
      {/* Fake content — swaps on route change */}
      <ContentSwap
        id={path}
        variant="fade"
        mode={mode}
        duration={180}
        className="flex-1 p-5"
      >
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">
            route
          </div>
          <div className="font-mono text-white/90 text-lg mb-4">{path}</div>
          <div className="text-sm text-white/65 leading-relaxed">
            This panel is what the router would render. The sidebar on the
            left is outside the transition wrapper, so it&apos;s pinned —
            exactly the feel you want in a real operator UI.
          </div>
        </div>
      </ContentSwap>
    </div>
  );
}

function TabsDemo() {
  const tabs = [
    { id: "overview", label: "Overview", body: "Aggregates, health, activity feed." },
    { id: "members", label: "Members", body: "A list of people with roles and last-seen." },
    { id: "settings", label: "Settings", body: "Preferences, integrations, danger zone." },
  ];
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;
  return (
    <div className="flex flex-col gap-0">
      <div className="flex gap-1 border-b border-white/10 px-2">
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={
                "px-3 py-2 text-xs transition-colors " +
                (on
                  ? "text-white border-b-2 border-fuchsia-400"
                  : "text-white/55 hover:text-white/85")
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <ContentSwap id={current.id} variant="fade-up" duration={170} className="p-5">
        <div className="text-sm text-white/80">{current.body}</div>
      </ContentSwap>
    </div>
  );
}

function WizardDemo() {
  const steps = [
    { title: "Identify", body: "Name and describe the resource." },
    { title: "Configure", body: "Pick a blueprint, region and size." },
    { title: "Review", body: "Confirm everything and launch." },
  ];
  const [i, setI] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const go = (d: 1 | -1) => {
    setDir(d);
    setI((n) => Math.max(0, Math.min(steps.length - 1, n + d)));
  };
  const s = steps[i];
  const variant: ContentSwapVariant = dir === 1 ? "slide-left" : "slide-right";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => go(-1)} disabled={i === 0}>
          Back
        </Button>
        <Button size="sm" variant="primary" onClick={() => go(1)} disabled={i === steps.length - 1}>
          Next
        </Button>
        <span className="ml-auto text-xs text-white/50">
          step {i + 1} / {steps.length}
        </span>
      </div>
      <div className="relative rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]" style={{ minHeight: 140 }}>
        <ContentSwap id={i} variant={variant} duration={200} className="p-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">
              Step {i + 1}
            </div>
            <div className="text-white/90 font-medium mb-2">{s.title}</div>
            <div className="text-sm text-white/65">{s.body}</div>
          </div>
        </ContentSwap>
      </div>
    </div>
  );
}
