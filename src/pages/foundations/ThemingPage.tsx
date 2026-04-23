import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import { CodeBlock } from "../../components/dev/CodeBlock";
import { Button } from "../../components/buttons/Button";
import {
  useHarborTheme,
  normalizeColor,
  type ResolvedTheme,
} from "../../lib/theme";
import { cn } from "../../lib/cn";

// ---------------------------------------------------------------------------
// Live theme picker — cards for every registered theme. Clicking applies
// the theme globally (HarborProvider lives in Layout).
// ---------------------------------------------------------------------------

function ThemePicker() {
  const { theme, themes, setTheme } = useHarborTheme();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {themes.map((t) => (
        <ThemeCard
          key={t.name}
          t={t}
          active={t.name === theme}
          onClick={() => setTheme(t.name)}
        />
      ))}
    </div>
  );
}

function ThemeCard({
  t,
  active,
  onClick,
}: {
  t: ResolvedTheme;
  active: boolean;
  onClick: () => void;
}) {
  const preview = t.meta?.preview;
  const gradient = preview
    ? `linear-gradient(135deg, ${preview.primary}, ${preview.surface})`
    : "rgb(var(--harbor-bg-elev-2))";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border text-left transition-all",
        active
          ? "border-[rgb(var(--harbor-accent))] bg-[rgb(var(--harbor-accent)/0.1)] ring-1 ring-[rgb(var(--harbor-accent)/0.35)]"
          : "border-white/10 hover:border-white/25 hover:bg-white/5",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg shrink-0 border border-white/10"
          style={{ background: gradient }}
          aria-hidden
        />
        <div className="min-w-0">
          <div className="text-sm font-medium text-white truncate">
            {t.label ?? t.name}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/45 mt-0.5">
            {t.colorScheme} · {t.name}
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Token descriptions — the source of truth for "what does this token
// actually govern?". TokenRow looks up the entry by CSS var name so
// every table gets the description for free without duplication.
// ---------------------------------------------------------------------------

const TOKEN_DOCS: Record<string, string> = {
  // Colour · brand + accents
  "--harbor-accent":
    "System accent — selection rings, focus outlines, ring glows, link colour. Change this to re-tint every interactive highlight at once.",
  "--harbor-accent-2":
    "Secondary accent used for decorative gradients, mesh backgrounds and chart palettes. Never used alone for meaning.",
  "--harbor-accent-3":
    "Tertiary accent — third stop in gradients and multi-colour charts. Pairs with accent and accent-2.",
  "--harbor-brand":
    "Product brand colour — primary CTAs, logo surfaces, marketing blocks. Defaults to --harbor-accent; override independently when the brand differs from the system accent.",
  "--harbor-brand-fg":
    "Foreground (text / icon) colour layered on top of brand-filled surfaces. Usually white for dark brands, black for pale ones.",

  // Colour · semantic tones
  "--harbor-success":
    "Positive state — valid form fields, success toasts, confirmation banners, upward trends.",
  "--harbor-warning":
    "Cautionary state — warning toasts, attention banners, approaching-limit meters.",
  "--harbor-danger":
    "Destructive / error state — delete buttons, error toasts, invalid fields, critical alerts.",
  "--harbor-info":
    "Informational state — info toasts, neutral annotations, keyboard-shortcut hints, loading messages.",

  // Colour · surfaces
  "--harbor-bg":
    "Page background. Ambient mesh gradients blend on top of this colour.",
  "--harbor-bg-elev-1":
    "First elevation — inputs, dropdowns, resting cards. Subtly lighter than the page on dark themes.",
  "--harbor-bg-elev-2":
    "Second elevation — floating menus, popovers, tooltips and hover cards.",
  "--harbor-bg-elev-3":
    "Third elevation — dialogs and modal sheets. Highest surface in the stack.",

  // Colour · text & borders
  "--harbor-text":
    "Primary body text — paragraphs, form values, emphasized labels.",
  "--harbor-text-muted":
    "Secondary text — captions, helper hints under inputs, metadata lists.",
  "--harbor-text-subtle":
    "Tertiary text — placeholders, disabled labels, timestamps, inline hints.",
  "--harbor-border":
    "Base border channel. Consumed with opacity modifiers (border-white/10, etc.) so the same token yields both subtle and strong variants.",

  // Typography · families
  "--harbor-font-sans":
    "Default sans-serif stack for body, headings, controls and labels. Load the font in your app shell; this token only names it.",
  "--harbor-font-mono":
    "Monospace stack for code blocks, identifiers, numeric readouts and terminal-styled UI.",

  // Typography · sizes
  "--harbor-text-xs":
    "Fine print — badges, inline labels, keyboard hints, timestamps.",
  "--harbor-text-sm":
    "Secondary body — controls, table cells, compact descriptions, list metadata.",
  "--harbor-text-base":
    "Default body size — paragraphs, standard form labels, card descriptions.",
  "--harbor-text-lg":
    "Emphasised body — card titles, toast titles, preview callouts.",
  "--harbor-text-xl":
    "Section subheads inside pages and long dialogs.",
  "--harbor-text-2xl":
    "Small page titles, card section headers, dashboard module titles.",
  "--harbor-text-3xl":
    "Page titles and hero subheads.",
  "--harbor-text-4xl":
    "Hero headings — landing pages, onboarding flows, marketing cards.",
  "--harbor-text-5xl":
    "Display headings — above-the-fold marketing copy, splash screens.",

  // Typography · line heights
  "--harbor-leading-tight":
    "Tight — headings and short buttons where stacked lines would feel slack.",
  "--harbor-leading-snug":
    "Snug — subheads and card descriptions.",
  "--harbor-leading-normal":
    "Normal — default for body copy and controls.",
  "--harbor-leading-relaxed":
    "Relaxed — long-form reading material, articles, documentation.",
  "--harbor-leading-loose":
    "Loose — display copy and promotional prose that benefits from extra air.",

  // Typography · letter spacing
  "--harbor-tracking-tight":
    "Tight — display headings where default tracking feels airy.",
  "--harbor-tracking-normal":
    "Normal — body default; no adjustment.",
  "--harbor-tracking-wide":
    "Wide — short all-caps labels and eyebrow kickers.",
  "--harbor-tracking-widest":
    "Widest — spaced-out uppercase section kickers and navigation groups.",

  // Spacing
  "--harbor-space-0":
    "Zero — reset utility; no padding or gap.",
  "--harbor-space-1":
    "Hairline gap between tightly-related elements (icon + label).",
  "--harbor-space-2":
    "Control internal padding (chips, small buttons) and compact row gaps.",
  "--harbor-space-3":
    "Button padding, list item spacing, medium internal gaps.",
  "--harbor-space-4":
    "Default card padding, form field vertical gaps, section internal rhythm.",
  "--harbor-space-5":
    "Section internal spacing and larger card padding.",
  "--harbor-space-6":
    "Card gaps, grid gutters, dialog internal spacing.",
  "--harbor-space-8":
    "Section padding on mobile and separation between adjacent cards.",
  "--harbor-space-10":
    "Section vertical rhythm on desktop.",
  "--harbor-space-12":
    "Large hero gaps and section breaks.",
  "--harbor-space-16":
    "Page-level section divides for marketing and dashboard layouts.",
  "--harbor-space-20":
    "Extra breathing room — marketing sections, editorial layouts.",
  "--harbor-space-24":
    "Maximal vertical rhythm — splash screens, above-the-fold breaks.",

  // Radius
  "--harbor-radius-none":
    "Flat rectangles — dense tables, editor chrome, strict grids.",
  "--harbor-radius-sm":
    "Chips, badges, pill tags, small toggle buttons.",
  "--harbor-radius-md":
    "Inputs, medium buttons, select triggers, small cards.",
  "--harbor-radius-lg":
    "Primary card rounding — default for Card, Panel, Notification.",
  "--harbor-radius-xl":
    "Dialog and drawer rounding, large feature cards.",
  "--harbor-radius-2xl":
    "Hero containers and marketing cards where softness is part of the brand.",
  "--harbor-radius-full":
    "Circular shapes — avatars, icon buttons, pill buttons.",

  // Shadow
  "--harbor-shadow-sm":
    "Resting elevation — cards at rest, hoverable buttons before hover.",
  "--harbor-shadow-md":
    "Floating elevation — popovers, dropdowns, cards on hover.",
  "--harbor-shadow-lg":
    "Modal elevation — dialogs, sheets, command palettes that dim the page behind.",
  "--harbor-shadow-glow":
    "Decorative glow anchored to --harbor-accent — featured CTAs, magic-feel buttons, selected states.",

  // Motion · durations
  "--harbor-dur-instant":
    "Instant — click/tap feedback, checkbox toggles, pressed states.",
  "--harbor-dur-fast":
    "Fast — hovers, small state transitions, colour swaps.",
  "--harbor-dur-base":
    "Default — accordion expansions, tab switches, panel reveals.",
  "--harbor-dur-slow":
    "Slow — modals, drawer slides, larger layout rearrangement.",
  "--harbor-dur-slower":
    "Slower — orchestrated multi-step sequences, hero entrances.",

  // Motion · easings
  "--harbor-ease-linear":
    "Linear — progress bars, spinners, anything with constant velocity.",
  "--harbor-ease-out":
    "Default UI curve — decelerates into rest. Use for enter animations.",
  "--harbor-ease-in-out":
    "Symmetric — layout changes where both ends feel intentional.",
  "--harbor-ease-spring":
    "Playful overshoot — buttons, toasts, elements that should feel alive.",
};

// ---------------------------------------------------------------------------
// Token reference helpers — each cell reads the *computed* CSS var value
// from the document root, so values reflect the currently active theme.
// ---------------------------------------------------------------------------

function useCssVar(name: string): string {
  const { theme } = useHarborTheme();
  const [value, setValue] = useState("");
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      setValue(v);
    });
    return () => cancelAnimationFrame(id);
  }, [name, theme]);
  return value;
}

function TokenRow({
  tokenKey,
  cssVar,
  children,
}: {
  tokenKey: string;
  cssVar: string;
  children: React.ReactNode;
}) {
  const value = useCssVar(cssVar);
  const desc = TOKEN_DOCS[cssVar];
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 items-start py-3 border-b border-white/5 last:border-b-0">
      <div className="flex items-start gap-3 min-w-0">
        <div className="shrink-0 pt-0.5">{children}</div>
        <div className="min-w-0 flex flex-col gap-0.5">
          <div className="font-mono text-xs text-white/85 truncate">
            {tokenKey}
          </div>
          <div className="font-mono text-[10px] text-white/40 truncate">
            {cssVar}
          </div>
          {desc ? (
            <p className="text-xs text-white/55 leading-snug mt-1">{desc}</p>
          ) : null}
        </div>
      </div>
      <div className="font-mono text-[11px] text-white/55 shrink-0 whitespace-nowrap pt-0.5">
        {value || "—"}
      </div>
    </div>
  );
}

function ColorTokenRow({
  tokenKey,
  cssVar,
}: {
  tokenKey: string;
  cssVar: string;
}) {
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      <div
        className="w-8 h-8 rounded-md shrink-0 border border-white/10"
        style={{ background: `rgb(var(${cssVar}))` }}
        aria-hidden
      />
    </TokenRow>
  );
}

function TypographyTokenRow({
  tokenKey,
  cssVar,
  kind,
}: {
  tokenKey: string;
  cssVar: string;
  kind: "size" | "family" | "leading" | "tracking";
}) {
  const value = useCssVar(cssVar);
  const sample =
    kind === "size" ? (
      <span
        className="text-white/85 shrink-0 w-16 text-right font-sans"
        style={{ fontSize: `var(${cssVar})` }}
      >
        Aa
      </span>
    ) : kind === "family" ? (
      <span
        className="text-white/85 shrink-0 w-24 truncate"
        style={{ fontFamily: `var(${cssVar})` }}
      >
        The quick
      </span>
    ) : kind === "leading" ? (
      <span
        className="text-white/85 shrink-0 w-24 text-[11px] truncate"
        style={{ lineHeight: `var(${cssVar})` }}
        title={value}
      >
        {value}
      </span>
    ) : (
      <span
        className="text-white/85 shrink-0 w-24 truncate text-[13px]"
        style={{ letterSpacing: `var(${cssVar})` }}
      >
        Harbor
      </span>
    );
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      {sample}
    </TokenRow>
  );
}

function SpacingTokenRow({
  tokenKey,
  cssVar,
}: {
  tokenKey: string;
  cssVar: string;
}) {
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      <div
        className="h-3 rounded-sm bg-[rgb(var(--harbor-accent)/0.5)] shrink-0"
        style={{ width: `var(${cssVar})`, minWidth: 1 }}
        aria-hidden
      />
    </TokenRow>
  );
}

function RadiusTokenRow({
  tokenKey,
  cssVar,
}: {
  tokenKey: string;
  cssVar: string;
}) {
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      <div
        className="w-10 h-10 shrink-0 bg-[rgb(var(--harbor-accent)/0.35)] border border-[rgb(var(--harbor-accent))]"
        style={{ borderRadius: `var(${cssVar})` }}
        aria-hidden
      />
    </TokenRow>
  );
}

function ShadowTokenRow({
  tokenKey,
  cssVar,
}: {
  tokenKey: string;
  cssVar: string;
}) {
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      <div
        className="w-16 h-10 shrink-0 rounded-md bg-[rgb(var(--harbor-bg-elev-2))]"
        style={{ boxShadow: `var(${cssVar})` }}
        aria-hidden
      />
    </TokenRow>
  );
}

function MotionTokenRow({
  tokenKey,
  cssVar,
}: {
  tokenKey: string;
  cssVar: string;
}) {
  return (
    <TokenRow tokenKey={tokenKey} cssVar={cssVar}>
      <div className="w-12 shrink-0 text-[10px] text-white/40 font-mono uppercase tracking-wider">
        {tokenKey.startsWith("dur") ? "dur" : "ease"}
      </div>
    </TokenRow>
  );
}

// ---------------------------------------------------------------------------
// Reads current resolved theme and mirrors it in JSX. Used to demo
// `useHarborTheme`.
// ---------------------------------------------------------------------------

function CurrentThemeReader() {
  const { theme, colorScheme, systemColorScheme } = useHarborTheme();
  return (
    <div className="flex flex-col gap-1.5 text-sm w-full">
      <Stat label="theme" value={theme} />
      <Stat label="colorScheme" value={colorScheme} />
      <Stat label="systemColorScheme" value={systemColorScheme} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 font-mono text-xs">
      <span className="text-white/45">{label}</span>
      <span className="text-[rgb(var(--harbor-accent))]">{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Live playground: pickers that mutate CSS custom properties on a
// scoped container + a CodeBlock showing the equivalent defineTheme call.
// ---------------------------------------------------------------------------

type RadiusPreset = "sharp" | "default" | "round" | "pill";
type DensityPreset = "compact" | "default" | "comfortable";

const RADIUS_VALUES: Record<RadiusPreset, string> = {
  sharp: "2px",
  default: "14px",
  round: "20px",
  pill: "9999px",
};

const DENSITY_SPACE_4: Record<DensityPreset, string> = {
  compact: "12px",
  default: "16px",
  comfortable: "20px",
};

const FONT_PRESETS: { label: string; value: string }[] = [
  { label: "Inter (default)", value: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  { label: "System UI", value: "ui-sans-serif, system-ui, sans-serif" },
  { label: "Geist", value: '"Geist", ui-sans-serif, sans-serif' },
  { label: "Space Grotesk", value: '"Space Grotesk", system-ui, sans-serif' },
  { label: "IBM Plex Sans", value: '"IBM Plex Sans", system-ui, sans-serif' },
];

function ThemeBuilder() {
  const [accent, setAccent] = useState("#FF6B35");
  const [fontIndex, setFontIndex] = useState(0);
  const [radius, setRadius] = useState<RadiusPreset>("default");
  const [density, setDensity] = useState<DensityPreset>("default");

  const accentTriplet = useMemo(() => normalizeColor(accent), [accent]);
  const font = FONT_PRESETS[fontIndex];

  const previewStyle: CSSProperties = {
    ["--harbor-accent" as string]: accentTriplet,
    ["--harbor-brand" as string]: accentTriplet,
    ["--harbor-font-sans" as string]: font.value,
    ["--harbor-radius-lg" as string]: RADIUS_VALUES[radius],
    ["--harbor-radius-xl" as string]: RADIUS_VALUES[radius],
    ["--harbor-space-4" as string]: DENSITY_SPACE_4[density],
    fontFamily: font.value,
  };

  const snippet = `import { defineTheme, HarborProvider } from "@infinibay/harbor/theme";

const myTheme = defineTheme({
  name: "my-theme",
  label: "My Brand",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: {
      accent: "${accent}",
      brand: "${accent}",
    },
    typography: {
      fontSans: '${font.value}',
    },
    radius: {
      lg: "${RADIUS_VALUES[radius]}",
      xl: "${RADIUS_VALUES[radius]}",
    },
    spacing: {
      4: "${DENSITY_SPACE_4[density]}",
    },
  },
});

<HarborProvider themes={[myTheme]} defaultTheme="my-theme">
  <App />
</HarborProvider>`;

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="grid md:grid-cols-[auto_1fr] gap-5">
        <div className="flex flex-col gap-4 min-w-[200px]">
          <Field label="Accent color">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-10 h-10 rounded-md cursor-pointer bg-transparent border border-white/15"
                aria-label="Pick accent color"
              />
              <span className="font-mono text-xs text-white/70">{accent}</span>
            </div>
          </Field>

          <Field label="Font family">
            <select
              value={fontIndex}
              onChange={(e) => setFontIndex(Number(e.target.value))}
              className="w-full bg-white/5 text-white/85 border border-white/10 rounded-md px-2 py-1.5 text-sm"
            >
              {FONT_PRESETS.map((f, i) => (
                <option key={f.label} value={i}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Radius">
            <PresetRow
              value={radius}
              onChange={setRadius}
              options={["sharp", "default", "round", "pill"]}
            />
          </Field>

          <Field label="Density">
            <PresetRow
              value={density}
              onChange={setDensity}
              options={["compact", "default", "comfortable"]}
            />
          </Field>
        </div>

        <div
          style={previewStyle}
          className="rounded-xl border border-white/10 bg-[rgb(var(--harbor-bg-elev-1))] p-[var(--harbor-space-4)] flex flex-col gap-[var(--harbor-space-4)]"
        >
          <div className="text-[10px] uppercase tracking-wider text-white/40">
            Live preview
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div
            className="p-[var(--harbor-space-4)] rounded-[var(--harbor-radius-lg)] border border-[rgb(var(--harbor-accent))] bg-[rgb(var(--harbor-accent)/0.12)]"
          >
            <div className="text-[rgb(var(--harbor-accent))] text-sm font-medium mb-1">
              Accent card
            </div>
            <div className="text-xs text-white/65 leading-relaxed">
              Uses --harbor-accent, --harbor-radius-lg and --harbor-space-4
              from the scoped style above.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Draft", "Review", "Shipped"].map((chip) => (
              <span
                key={chip}
                className="text-[11px] px-2 py-1 rounded-[var(--harbor-radius-lg)] bg-white/8 text-white/75 border border-white/10"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      <CodeBlock
        lang="tsx"
        title="defineTheme"
        code={snippet}
        showLineNumbers={false}
      />
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-wider text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

function PresetRow<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "text-xs px-2.5 py-1 rounded-md border transition-colors",
            value === o
              ? "bg-[rgb(var(--harbor-accent)/0.2)] text-white border-[rgb(var(--harbor-accent)/0.5)]"
              : "bg-white/5 text-white/65 border-white/10 hover:border-white/25",
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

// Click-to-activate the pre-registered "sunset" theme (which implements
// the walkthrough's exact defineTheme call). Lets readers of Step 4 see
// the payoff without reloading.
function ActivateSunsetDemo() {
  const { theme, setTheme } = useHarborTheme();
  const active = theme === "sunset";
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        variant={active ? "secondary" : "primary"}
        onClick={() => setTheme(active ? "harbor-dark" : "sunset")}
      >
        {active ? "Revert to harbor-dark" : "Activate the sunset theme"}
      </Button>
      <p className="text-xs text-white/45 max-w-sm text-center">
        Toggles the globally registered demo theme (defined in
        src/showcase/demoThemes.ts). The whole showcase repaints in
        the theme's accent.
      </p>
    </div>
  );
}

// Scoped runtime-override demo: subtree inherits cyan accent without
// touching the Provider. Used in the "Modifying tokens" section.
function ScopedOverrideDemo() {
  const style: CSSProperties = {
    ["--harbor-accent" as string]: "34 211 238",
    ["--harbor-brand" as string]: "34 211 238",
  };
  return (
    <div
      style={style}
      className="p-4 rounded-xl border border-[rgb(var(--harbor-accent))] bg-[rgb(var(--harbor-accent)/0.08)] w-full"
    >
      <div className="text-xs uppercase tracking-wider text-[rgb(var(--harbor-accent))] mb-2">
        Cyan subtree
      </div>
      <div className="flex gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pre-authored code snippets for demos that can't mount a live copy of
// <HarborProvider> (one provider per document; nesting would conflict).
// We pass them as the Demo's `source` prop so the CODE toggle shows the
// canonical example.
// ---------------------------------------------------------------------------

const providerSnippet = `import { HarborProvider } from "@infinibay/harbor/theme";

function App() {
  return (
    <HarborProvider
      defaultTheme={{ dark: "harbor-dark", light: "harbor-light" }}
      persist
    >
      <YourApp />
    </HarborProvider>
  );
}`;

const defineThemeSnippet = `import { defineTheme, HarborProvider } from "@infinibay/harbor/theme";

const acme = defineTheme({
  name: "acme",
  label: "Acme",
  colorScheme: "dark",
  tokens: {
    color: {
      accent: "#FF6B35",   // hex
      brand:  "#FF6B35",
      success: "16 185 129", // RGB triplet
      info:   "rgb(14,165,233)",
    },
    typography: {
      fontSans: '"Space Grotesk", system-ui, sans-serif',
    },
  },
});

<HarborProvider themes={[acme]} defaultTheme="acme">
  <App />
</HarborProvider>`;

const extendsSnippet = `// Inherit every token from harbor-dark, override only what's different.
const acmeDark = defineTheme({
  name: "acme-dark",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: { accent: "#FF6B35", brand: "#FF6B35" },
  },
});

// Sibling variant: shares accent, flips surfaces via harbor-light.
const acmeLight = defineTheme({
  name: "acme-light",
  colorScheme: "light",
  extends: "harbor-light",
  tokens: {
    color: { accent: "#FF6B35", brand: "#FF6B35" },
  },
});`;

const systemPrefSnippet = `// Pair form: Provider tracks the OS-level preference automatically
// and flips between the named themes as it changes.
<HarborProvider
  themes={[acmeDark, acmeLight]}
  defaultTheme={{ dark: "acme-dark", light: "acme-light" }}
>
  <App />
</HarborProvider>`;

const persistSnippet = `// persist: true stores the user's chosen theme in localStorage under
// the key "harbor-theme", so reloads keep the selection.
<HarborProvider persist>
  <App />
</HarborProvider>

// Or customise the storage target:
<HarborProvider persist={{ key: "my-theme", storage: sessionStorage }}>
  <App />
</HarborProvider>`;

const controlledSnippet = `// Controlled mode: the parent owns the theme state. Persistence and
// system-preference tracking are then the caller's responsibility.
function App() {
  const [theme, setTheme] = useState("harbor-dark");
  return (
    <HarborProvider theme={theme} onThemeChange={setTheme}>
      <YourApp />
      <button onClick={() => setTheme("harbor-light")}>Go light</button>
    </HarborProvider>
  );
}`;

const overrideSnippet = `// Any CSS custom property from tokens.css can be overridden on a
// subtree without touching the Provider — useful for one-off banners
// or brand-specific sections.
<section style={{ "--harbor-accent": "34 211 238" /* cyan */ }}>
  <Button variant="primary">Everything inside now reads cyan</Button>
</section>`;

// ---------------------------------------------------------------------------
// Walkthrough snippets: each step builds on the previous. The reader
// should be able to copy-paste these in order and end up with a
// working custom theme.
// ---------------------------------------------------------------------------

const stepOneSnippet = `// Take the primary colour from your brand guidelines. Harbor accepts
// hex, rgb(), or RGB triplets — pick whichever your designers already
// have on hand.
const BRAND = "#FF6B35";`;

const stepTwoSnippet = `import { defineTheme } from "@infinibay/harbor/theme";

// Define a theme. Extending "harbor-dark" means you only declare
// what differs — everything else (surfaces, typography, spacing)
// inherits. colorScheme is always explicit, never inherited.
const myTheme = defineTheme({
  name: "my-brand",
  label: "My Brand",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: {
      accent: BRAND,
      brand: BRAND,
    },
  },
});`;

const stepThreeSnippet = `import { HarborProvider } from "@infinibay/harbor/theme";

// Mount the Provider once at the root of your app. Pass your theme
// in the themes array and point defaultTheme at its name.
export function App() {
  return (
    <HarborProvider
      themes={[myTheme]}
      defaultTheme="my-brand"
      persist
    >
      <YourApp />
    </HarborProvider>
  );
}`;

const stepFourSnippet = `import { useHarborTheme } from "@infinibay/harbor/theme";

// Users can switch themes from anywhere via the hook.
function ThemeSwitcher() {
  const { theme, themes, setTheme } = useHarborTheme();
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {themes.map((t) => (
        <option key={t.name} value={t.name}>{t.label ?? t.name}</option>
      ))}
    </select>
  );
}`;

// ---------------------------------------------------------------------------
// "Modifying tokens" snippets — three mechanisms, each with a clear
// trade-off explained in the Demo's hint.
// ---------------------------------------------------------------------------

const modifyExtendsSnippet = `// Recommended for themes you ship and reuse. Inherit everything, then
// override the tokens that differ. Works for any category — color,
// typography, spacing, radius, shadow, motion.
const myTheme = defineTheme({
  name: "my-brand",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: { accent: "#FF6B35", brand: "#FF6B35" },
    typography: { fontSans: '"Geist", sans-serif' },
    radius: { lg: "20px", xl: "28px" },
  },
});`;

const modifyReplaceSnippet = `// Registering a theme with the same name as a built-in replaces it.
// Useful when you want YOUR defaults instead of Harbor's — every
// component continues to resolve "harbor-dark" just fine.
const myDark = defineTheme({
  name: "harbor-dark",       // same name as the built-in
  colorScheme: "dark",
  tokens: {
    color: { accent: "#FF6B35", bg: "5 5 10" },
    // …all other tokens fall back to the in-CSS defaults
  },
});

<HarborProvider themes={[myDark]}>
  <App />
</HarborProvider>`;

const modifyScopedSnippet = `// Zero configuration: override any CSS variable on a subtree. The
// override applies only to descendants — the rest of the app keeps
// the active theme's values.
<section style={{
  "--harbor-accent": "34 211 238",
  "--harbor-brand":  "34 211 238",
}}>
  <Button variant="primary">Cyan inside this section only</Button>
</section>`;

// ---------------------------------------------------------------------------
// Recipe snippets — the five most common "I want to customise X"
// scenarios, each one a fully-working minimal example.
// ---------------------------------------------------------------------------

const recipeBrandSnippet = `// The 90% case: change one colour and ship.
const myBrand = defineTheme({
  name: "my-brand",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    color: { accent: "#8B5CF6", brand: "#8B5CF6" },
  },
});`;

const recipePairSnippet = `// Ship a coherent dark/light pair that share your brand accent.
// The Provider follows the OS preference automatically when given
// the pair form.
const brandDark = defineTheme({
  name: "brand-dark",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: { color: { accent: "#FF6B35", brand: "#FF6B35" } },
});

const brandLight = defineTheme({
  name: "brand-light",
  colorScheme: "light",
  extends: "harbor-light",
  tokens: { color: { accent: "#FF6B35", brand: "#FF6B35" } },
});

<HarborProvider
  themes={[brandDark, brandLight]}
  defaultTheme={{ dark: "brand-dark", light: "brand-light" }}
  persist
>`;

const recipeTypographySnippet = `// Font families + a larger base size. Every component that uses
// \`text-base\` inherits the new scale automatically (Tailwind
// utilities resolve to --harbor-text-*).
const editorial = defineTheme({
  name: "editorial",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    typography: {
      fontSans: '"Inter Tight", ui-sans-serif, sans-serif',
      fontMono: '"JetBrains Mono", ui-monospace, monospace',
      textBase: "16px",
      leadingRelaxed: "1.75",
    },
  },
});`;

const recipeDensitySnippet = `// Compact for data-dense SaaS; comfortable for reading apps.
// Override the spacing tokens your components use most (4/5/6 are
// the usual padding/gap choices).
const compact = defineTheme({
  name: "compact",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    spacing: {
      3: "8px",    // default 12px
      4: "12px",   // default 16px
      5: "14px",   // default 20px
      6: "18px",   // default 24px
    },
  },
});`;

const recipeRadiusSnippet = `// Sharper identity — flatter rectangles across the board.
const angular = defineTheme({
  name: "angular",
  colorScheme: "dark",
  extends: "harbor-dark",
  tokens: {
    radius: {
      sm: "2px",
      md: "4px",
      lg: "6px",
      xl: "8px",
      "2xl": "12px",
    },
  },
});`;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export function ThemingPage() {
  return (
    <>
      <Group
        id="theming-intro"
        title="Theming"
        desc="Named themes with tokens for color, typography, spacing, radius, shadow and motion. Switch at runtime, inherit between themes, persist per user, or take full control from the parent."
      >
        <Demo
          title="Active theme"
          hint="Click any card to apply it to the entire showcase."
          wide
          intensity="soft"
        >
          <ThemePicker />
        </Demo>

        <Demo
          title="useHarborTheme"
          hint="Read the active theme from any component."
          source={`import { useHarborTheme } from "@infinibay/harbor/theme";

function StatusBadge() {
  const { theme, colorScheme, systemColorScheme, setTheme } = useHarborTheme();
  return (
    <div>
      theme: {theme}
      colorScheme: {colorScheme}
      systemColorScheme: {systemColorScheme}
    </div>
  );
}`}
        >
          <CurrentThemeReader />
        </Demo>
      </Group>

      <Group
        id="theming-tutorial"
        title="Tutorial · your first theme"
        desc="Four steps from brand colour to a registered, switchable theme. Each snippet builds on the previous."
      >
        <Demo
          title="Step 1 · pick a brand colour"
          hint="Hex, rgb(), or RGB triplet — whatever your guidelines use."
          wide
          intensity="quiet"
          source={stepOneSnippet}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-16 h-16 rounded-xl border border-white/10 shrink-0"
              style={{ background: "#FF6B35" }}
              aria-hidden
            />
            <div className="text-sm text-white/65 leading-relaxed max-w-md">
              We'll use <code className="text-[rgb(var(--harbor-accent))]">#FF6B35</code>
              for this walkthrough. It matches the pre-registered
              "sunset" demo theme so you can see the result live.
            </div>
          </div>
        </Demo>

        <Demo
          title="Step 2 · defineTheme"
          hint="Validate and normalise the definition."
          wide
          intensity="quiet"
          source={stepTwoSnippet}
        >
          <p className="text-sm text-white/55 text-center max-w-md">
            <code className="text-white/85">defineTheme</code> is a pure
            factory: no side effects, safe to call at module scope.
            Colours are normalised to RGB triplets automatically.
          </p>
        </Demo>

        <Demo
          title="Step 3 · register with HarborProvider"
          hint="One Provider at the root of the app."
          wide
          intensity="quiet"
          source={stepThreeSnippet}
        >
          <p className="text-sm text-white/55 text-center max-w-md">
            The <code className="text-white/85">themes</code> array is
            additive — Harbor's built-ins stay registered alongside
            yours. Pass <code className="text-white/85">persist</code>
            to remember the user's selection across reloads.
          </p>
        </Demo>

        <Demo
          title="Step 4 · activate & verify"
          hint="Switch from any component via useHarborTheme."
          wide
          intensity="quiet"
          source={stepFourSnippet}
        >
          <ActivateSunsetDemo />
        </Demo>
      </Group>

      <Group
        id="theming-modify"
        title="Modifying tokens"
        desc="Three orthogonal ways to change what the system renders. Pick the one that matches the reach of your change."
      >
        <Demo
          title="Extend + override"
          hint="Recommended. Ships as a named theme."
          wide
          intensity="quiet"
          source={modifyExtendsSnippet}
        >
          <div className="text-sm text-white/55 max-w-md text-center">
            Use for any persistent customisation you'll reference by
            name. Supports every token category.
          </div>
        </Demo>

        <Demo
          title="Replace a built-in"
          hint="Keep Harbor's name, swap its content."
          wide
          intensity="quiet"
          source={modifyReplaceSnippet}
        >
          <div className="text-sm text-white/55 max-w-md text-center">
            Register a theme with <code>name: "harbor-dark"</code> (or
            <code> "harbor-light"</code>) to make your values the
            defaults. Consumers of those names get your rebrand
            automatically.
          </div>
        </Demo>

        <Demo
          title="Scoped runtime override"
          hint="Zero config. One-off sections, A/B previews, embeds."
          wide
          intensity="quiet"
          source={modifyScopedSnippet}
        >
          <ScopedOverrideDemo />
        </Demo>
      </Group>

      <Group
        id="theming-recipes"
        title="Recipes · common customisations"
        desc="Copy-paste starting points for the five scenarios most teams hit first."
      >
        <Demo
          title="Just my brand colour"
          hint="The 90% case."
          wide
          intensity="quiet"
          source={recipeBrandSnippet}
        >
          <div className="text-sm text-white/55 max-w-md">
            Changes selection rings, focus outlines, CTAs, and the
            accent glow. Everything else keeps Harbor's defaults.
          </div>
        </Demo>

        <Demo
          title="Dark + light pair"
          hint="Follow the OS preference automatically."
          wide
          intensity="quiet"
          source={recipePairSnippet}
        >
          <div className="text-sm text-white/55 max-w-md">
            Two themes that share an accent but differ in colorScheme.
            The pair form of <code>defaultTheme</code> switches between
            them as the user's OS preference changes.
          </div>
        </Demo>

        <Demo
          title="Custom typography"
          hint="Families + scale overrides."
          wide
          intensity="quiet"
          source={recipeTypographySnippet}
        >
          <div className="text-sm text-white/55 max-w-md">
            Harbor doesn't load the fonts for you — drop
            <code> @font-face</code> or <code>next/font</code> in your
            app shell, then point the tokens at whatever stack you
            prefer.
          </div>
        </Demo>

        <Demo
          title="Tighter density"
          hint="Smaller spacings everywhere."
          wide
          intensity="quiet"
          source={recipeDensitySnippet}
        >
          <div className="text-sm text-white/55 max-w-md">
            Spacing tokens feed every <code>p-*</code> and
            <code> gap-*</code> utility. Shrinking 3/4/5/6 tightens
            most of the UI at once without touching components.
          </div>
        </Demo>

        <Demo
          title="Custom radius"
          hint="More angular or softer corners."
          wide
          intensity="quiet"
          source={recipeRadiusSnippet}
        >
          <div className="text-sm text-white/55 max-w-md">
            Radius tokens reach Buttons, Cards, Dialogs, and any
            component using the <code>rounded-*</code> Tailwind
            utilities.
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-playground"
        title="Playground · build live"
        desc="Pickers write CSS variables onto the preview container. The CodeBlock mirrors the equivalent defineTheme call in real time — copy it into your app to reproduce the look."
      >
        <Demo title="Theme builder" wide intensity="soft">
          <ThemeBuilder />
        </Demo>
      </Group>

      <Group
        id="theming-setup"
        title="Setup"
        desc="One Provider at the root of your app is all that's needed. The built-in harbor-dark and harbor-light themes ship registered out of the box."
      >
        <Demo title="HarborProvider" wide source={providerSnippet}>
          <p className="text-sm text-white/55 text-center max-w-md">
            The Provider is already mounted at the root of this showcase —
            that's how the picker above can change every page at once.
          </p>
        </Demo>
      </Group>

      <Group
        id="theming-authoring"
        title="Authoring themes"
        desc="`defineTheme` validates and normalises tokens. Colours accept hex, rgb(), or the RGB-triplet form Harbor stores internally."
      >
        <Demo title="defineTheme" hint="Basic shape" wide source={defineThemeSnippet}>
          <p className="text-sm text-white/55 text-center max-w-md">
            Every token category is optional. Omitted tokens inherit their
            defaults from the base theme.
          </p>
        </Demo>

        <Demo
          title="extends"
          hint="Inherit tokens, override only the delta."
          wide
          source={extendsSnippet}
        >
          <p className="text-sm text-white/55 text-center max-w-md">
            Child themes inherit every token from the parent, except
            colorScheme which must always be declared explicitly.
          </p>
        </Demo>
      </Group>

      <Group
        id="theming-activation"
        title="Activation strategies"
        desc="How the Provider decides which theme to activate."
      >
        <Demo
          title="System preference"
          hint="Pair form for automatic OS tracking."
          wide
          source={systemPrefSnippet}
        >
          <p className="text-sm text-white/55 text-center max-w-md">
            When the user hasn't made an explicit selection, Provider
            reacts to `prefers-color-scheme` and swaps between the two
            named themes automatically.
          </p>
        </Demo>

        <Demo title="persist" hint="Remember across reloads." source={persistSnippet}>
          <p className="text-sm text-white/55 text-center">
            The showcase uses `persist` — your selection sticks
            between page loads.
          </p>
        </Demo>

        <Demo
          title="Controlled"
          hint="Parent owns the state."
          source={controlledSnippet}
        >
          <p className="text-sm text-white/55 text-center">
            Useful for URL-driven theming, multi-tenant apps, or
            synchronising with an existing state store.
          </p>
        </Demo>
      </Group>

      <Group
        id="theming-runtime"
        title="Runtime overrides"
        desc="Every token is a CSS custom property, so any subtree can override it without touching the Provider."
      >
        <Demo
          title="Subtree branding"
          hint='style={{ "--harbor-accent": "34 211 238" }}'
          wide
          source={overrideSnippet}
        >
          <div className="flex flex-col gap-3 w-full items-center">
            <div
              className="px-6 py-4 rounded-lg border border-[rgb(var(--harbor-accent))] bg-[rgb(var(--harbor-accent)/0.1)] text-[rgb(var(--harbor-accent))] text-sm"
              style={{ ["--harbor-accent" as string]: "34 211 238" }}
            >
              Scoped to cyan — rest of the page unaffected.
            </div>
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-color-tokens"
        title="Color tokens"
        desc="All swatches below update live as you change themes."
      >
        <Demo title="Brand & accents" wide intensity="soft">
          <div className="w-full flex flex-col">
            <ColorTokenRow tokenKey="color.accent" cssVar="--harbor-accent" />
            <ColorTokenRow tokenKey="color.accent2" cssVar="--harbor-accent-2" />
            <ColorTokenRow tokenKey="color.accent3" cssVar="--harbor-accent-3" />
            <ColorTokenRow tokenKey="color.brand" cssVar="--harbor-brand" />
            <ColorTokenRow tokenKey="color.brandFg" cssVar="--harbor-brand-fg" />
          </div>
        </Demo>

        <Demo title="Semantic tones" wide intensity="soft">
          <div className="w-full flex flex-col">
            <ColorTokenRow tokenKey="color.success" cssVar="--harbor-success" />
            <ColorTokenRow tokenKey="color.warning" cssVar="--harbor-warning" />
            <ColorTokenRow tokenKey="color.danger" cssVar="--harbor-danger" />
            <ColorTokenRow tokenKey="color.info" cssVar="--harbor-info" />
          </div>
        </Demo>

        <Demo title="Surfaces" wide intensity="soft">
          <div className="w-full flex flex-col">
            <ColorTokenRow tokenKey="color.bg" cssVar="--harbor-bg" />
            <ColorTokenRow tokenKey="color.bgElev1" cssVar="--harbor-bg-elev-1" />
            <ColorTokenRow tokenKey="color.bgElev2" cssVar="--harbor-bg-elev-2" />
            <ColorTokenRow tokenKey="color.bgElev3" cssVar="--harbor-bg-elev-3" />
          </div>
        </Demo>

        <Demo title="Text & borders" wide intensity="soft">
          <div className="w-full flex flex-col">
            <ColorTokenRow tokenKey="color.text" cssVar="--harbor-text" />
            <ColorTokenRow
              tokenKey="color.textMuted"
              cssVar="--harbor-text-muted"
            />
            <ColorTokenRow
              tokenKey="color.textSubtle"
              cssVar="--harbor-text-subtle"
            />
            <ColorTokenRow tokenKey="color.border" cssVar="--harbor-border" />
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-typography-tokens"
        title="Typography tokens"
        desc="Font families, size scale, line-heights and letter-spacing."
      >
        <Demo title="Font families" wide intensity="quiet">
          <div className="w-full flex flex-col">
            <TypographyTokenRow
              tokenKey="typography.fontSans"
              cssVar="--harbor-font-sans"
              kind="family"
            />
            <TypographyTokenRow
              tokenKey="typography.fontMono"
              cssVar="--harbor-font-mono"
              kind="family"
            />
          </div>
        </Demo>

        <Demo title="Size scale" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["textXs", "--harbor-text-xs"],
                ["textSm", "--harbor-text-sm"],
                ["textBase", "--harbor-text-base"],
                ["textLg", "--harbor-text-lg"],
                ["textXl", "--harbor-text-xl"],
                ["text2xl", "--harbor-text-2xl"],
                ["text3xl", "--harbor-text-3xl"],
                ["text4xl", "--harbor-text-4xl"],
                ["text5xl", "--harbor-text-5xl"],
              ] as const
            ).map(([key, css]) => (
              <TypographyTokenRow
                key={key}
                tokenKey={`typography.${key}`}
                cssVar={css}
                kind="size"
              />
            ))}
          </div>
        </Demo>

        <Demo title="Line height" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["leadingTight", "--harbor-leading-tight"],
                ["leadingSnug", "--harbor-leading-snug"],
                ["leadingNormal", "--harbor-leading-normal"],
                ["leadingRelaxed", "--harbor-leading-relaxed"],
                ["leadingLoose", "--harbor-leading-loose"],
              ] as const
            ).map(([key, css]) => (
              <TypographyTokenRow
                key={key}
                tokenKey={`typography.${key}`}
                cssVar={css}
                kind="leading"
              />
            ))}
          </div>
        </Demo>

        <Demo title="Letter spacing" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["trackingTight", "--harbor-tracking-tight"],
                ["trackingNormal", "--harbor-tracking-normal"],
                ["trackingWide", "--harbor-tracking-wide"],
                ["trackingWidest", "--harbor-tracking-widest"],
              ] as const
            ).map(([key, css]) => (
              <TypographyTokenRow
                key={key}
                tokenKey={`typography.${key}`}
                cssVar={css}
                kind="tracking"
              />
            ))}
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-layout-tokens"
        title="Spacing, radius, shadow"
        desc="Geometry and depth tokens. The bars, shapes and boxes are rendered with each token live."
      >
        <Demo title="Spacing scale" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["0", "--harbor-space-0"],
                ["1", "--harbor-space-1"],
                ["2", "--harbor-space-2"],
                ["3", "--harbor-space-3"],
                ["4", "--harbor-space-4"],
                ["5", "--harbor-space-5"],
                ["6", "--harbor-space-6"],
                ["8", "--harbor-space-8"],
                ["10", "--harbor-space-10"],
                ["12", "--harbor-space-12"],
                ["16", "--harbor-space-16"],
                ["20", "--harbor-space-20"],
                ["24", "--harbor-space-24"],
              ] as const
            ).map(([key, css]) => (
              <SpacingTokenRow
                key={key}
                tokenKey={`spacing.${key}`}
                cssVar={css}
              />
            ))}
          </div>
        </Demo>

        <Demo title="Radius" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["none", "--harbor-radius-none"],
                ["sm", "--harbor-radius-sm"],
                ["md", "--harbor-radius-md"],
                ["lg", "--harbor-radius-lg"],
                ["xl", "--harbor-radius-xl"],
                ["2xl", "--harbor-radius-2xl"],
                ["full", "--harbor-radius-full"],
              ] as const
            ).map(([key, css]) => (
              <RadiusTokenRow
                key={key}
                tokenKey={`radius.${key}`}
                cssVar={css}
              />
            ))}
          </div>
        </Demo>

        <Demo title="Shadow" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["sm", "--harbor-shadow-sm"],
                ["md", "--harbor-shadow-md"],
                ["lg", "--harbor-shadow-lg"],
                ["glow", "--harbor-shadow-glow"],
              ] as const
            ).map(([key, css]) => (
              <ShadowTokenRow
                key={key}
                tokenKey={`shadow.${key}`}
                cssVar={css}
              />
            ))}
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-motion-tokens"
        title="Motion tokens"
        desc="Durations and easings. Behaviour-level configuration (reduced motion, speed multiplier) is on the roadmap."
      >
        <Demo title="Durations" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["durInstant", "--harbor-dur-instant"],
                ["durFast", "--harbor-dur-fast"],
                ["durBase", "--harbor-dur-base"],
                ["durSlow", "--harbor-dur-slow"],
                ["durSlower", "--harbor-dur-slower"],
              ] as const
            ).map(([key, css]) => (
              <MotionTokenRow
                key={key}
                tokenKey={`motion.${key}`}
                cssVar={css}
              />
            ))}
          </div>
        </Demo>

        <Demo title="Easings" wide intensity="quiet">
          <div className="w-full flex flex-col">
            {(
              [
                ["easeLinear", "--harbor-ease-linear"],
                ["easeOut", "--harbor-ease-out"],
                ["easeInOut", "--harbor-ease-in-out"],
                ["easeSpring", "--harbor-ease-spring"],
              ] as const
            ).map(([key, css]) => (
              <MotionTokenRow
                key={key}
                tokenKey={`motion.${key}`}
                cssVar={css}
              />
            ))}
          </div>
        </Demo>
      </Group>

      <Group
        id="theming-api"
        title="API cheatsheet"
        desc="Everything exported from @infinibay/harbor/theme."
      >
        <Demo title="Exports" wide intensity="quiet">
          <CodeBlock
            lang="ts"
            code={`import {
  HarborProvider,      // React context provider + style injection
  useHarborTheme,      // read active theme, setTheme, enumerate registry
  defineTheme,         // validate and normalise a theme definition
  harborDark,          // built-in default dark theme
  harborLight,         // built-in default light theme
  normalizeColor,      // hex / rgb() / triplet → "r g b"

  // Types
  type HarborTheme,
  type ResolvedTheme,
  type ColorTokens,
  type TypographyTokens,
  type SpacingTokens,
  type RadiusTokens,
  type ShadowTokens,
  type MotionTokens,
} from "@infinibay/harbor/theme";`}
          />
        </Demo>
      </Group>
    </>
  );
}
