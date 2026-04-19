import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import {
  AnimatedBackground,
  Aurora,
  Constellations,
  DotGrid,
  MeshGradient,
  Orbs,
  PlasmaField,
  Starfield,
  Waves,
  DEFAULT_PALETTE,
  type BackgroundVariant,
} from "../../components";

const PALETTES = {
  Harbor: [...DEFAULT_PALETTE],
  Sunset: ["#fb7185", "#f59e0b", "#fbbf24", "#f472b6"],
  Ocean: ["#0ea5e9", "#14b8a6", "#6366f1", "#3b82f6"],
  Forest: ["#10b981", "#84cc16", "#22c55e", "#fbbf24"],
  Mono: ["#a855f7"],
} as const;

type PaletteName = keyof typeof PALETTES;

export function BackgroundsPage() {
  const [variant, setVariant] = useState<BackgroundVariant>("mesh");
  const [speed, setSpeed] = useState(1);
  const [intensity, setIntensity] = useState(0.6);
  const [palette, setPalette] = useState<PaletteName>("Harbor");
  const [paused, setPaused] = useState(false);

  return (
    <Group
      id="backgrounds"
      title="Backgrounds"
      desc="Eight configurable animated backgrounds — composable, performance-aware (pauses when off-screen / tab hidden / reduced motion), no external deps."
    >
      <Demo
        title="Live playground"
        hint="Try each variant — same common props, variant-specific knobs below"
        wide
      >
        <Col className="gap-3 w-full">
          <Row className="gap-2 flex-wrap items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Variant
            </span>
            {(
              [
                "mesh",
                "aurora",
                "starfield",
                "dot-grid",
                "waves",
                "constellations",
                "orbs",
                "plasma",
              ] as BackgroundVariant[]
            ).map((v) => (
              <button
                key={v}
                onClick={() => setVariant(v)}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  variant === v
                    ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-100"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/5"
                }`}
              >
                {v}
              </button>
            ))}
          </Row>
          <Row className="gap-4 flex-wrap items-center text-xs text-white/70">
            <label className="flex items-center gap-2">
              speed
              <input
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
              <span className="tabular-nums font-mono w-8 text-right">{speed.toFixed(1)}</span>
            </label>
            <label className="flex items-center gap-2">
              intensity
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
              <span className="tabular-nums font-mono w-10 text-right">{intensity.toFixed(2)}</span>
            </label>
            <label className="flex items-center gap-2">
              palette
              <select
                value={palette}
                onChange={(e) => setPalette(e.target.value as PaletteName)}
                className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-fuchsia-400/40"
              >
                {Object.keys(PALETTES).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={paused}
                onChange={(e) => setPaused(e.target.checked)}
              />
              paused
            </label>
          </Row>
          <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a10]">
            <AnimatedBackground
              variant={variant as BackgroundVariant}
              speed={speed}
              intensity={intensity}
              palette={PALETTES[palette]}
              paused={paused}
            />
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div className="text-[10px] uppercase tracking-widest text-white/60">
                  variant
                </div>
                <div className="text-3xl font-semibold text-white mix-blend-difference">
                  {variant}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Demo>

      <Demo title="All eight · side-by-side" wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <MiniCard label="mesh">
            <MeshGradient />
          </MiniCard>
          <MiniCard label="aurora">
            <Aurora />
          </MiniCard>
          <MiniCard label="starfield">
            <Starfield />
          </MiniCard>
          <MiniCard label="dot-grid · perspective">
            <DotGrid motion="perspective" />
          </MiniCard>
          <MiniCard label="waves">
            <Waves />
          </MiniCard>
          <MiniCard label="constellations" hint="move cursor over me">
            <Constellations />
          </MiniCard>
          <MiniCard label="orbs">
            <Orbs />
          </MiniCard>
          <MiniCard label="plasma">
            <PlasmaField />
          </MiniCard>
        </div>
      </Demo>

      <Demo
        title="BackgroundScene wrapper · hero composition"
        hint="Drop content on top of any background"
        wide
      >
        <div className="relative h-[320px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a10]">
          <Orbs count={9} glow={60} intensity={0.85} />
          <DotGrid motion="pulse" color="rgba(255,255,255,0.15)" dotSize={0.8} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center px-6">
              <div className="text-[10px] uppercase tracking-widest text-fuchsia-200/70 mb-2">
                Infinibay · on-call
              </div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                Sleep better.
                <br />
                Ship faster.
              </h2>
              <p className="text-white/70 mt-3 max-w-sm mx-auto">
                Composed layers here: orbs + dot-grid pulse + centered
                content. Every layer lives behind the next.
              </p>
            </div>
          </div>
        </div>
      </Demo>

      <Demo title="Perf controls" hint="Every variant shares these props" wide>
        <Col className="gap-2 text-xs text-white/70">
          <code className="font-mono text-white/85 bg-black/40 rounded p-3 leading-relaxed">
            {`<AnimatedBackground
  variant="plasma"
  speed={1}               // 0 = frozen, 2+ = fast
  intensity={0.5}         // 0..1 (opacity/amplitude/density)
  palette={['#a855f7', ...]}
  paused={false}
  respectReducedMotion    // default true — static fallback
  pauseWhenHidden         // default true — document.hidden aware
  pauseWhenOutOfView      // default true — IntersectionObserver
/>`}
          </code>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <Bullet>CSS-only: <code>mesh</code>, <code>dot-grid</code>, <code>orbs</code></Bullet>
            <Bullet>SVG paths: <code>aurora</code>, <code>waves</code></Bullet>
            <Bullet>Canvas 2D: <code>starfield</code>, <code>constellations</code>, <code>plasma</code></Bullet>
            <Bullet>Plasma renders at 1/8 resolution + CSS-blur upscale</Bullet>
          </div>
        </Col>
      </Demo>
    </Group>
  );
}

function MiniCard({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a10]">
      {children}
      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-sm text-[10px] uppercase tracking-widest text-white/80">
        {label}
      </div>
      {hint ? (
        <div className="absolute bottom-2 left-2 text-[10px] text-white/60">{hint}</div>
      ) : null}
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-white/30">·</span>
      <span>{children}</span>
    </div>
  );
}
