import { useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import {
  AnimatedBackground,
  Aurora,
  BackgroundDistortion,
  Bubbles,
  Constellations,
  MacScape,
  MeshGradient,
  Orbs,
  PlasmaField,
  Waves,
  DEFAULT_PALETTE,
  type BackgroundVariant,
  type DistortionPreset,
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
  const [distortion, setDistortion] = useState<DistortionPreset | "none">("none");
  const [distIntensity, setDistIntensity] = useState(0.6);

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
                "waves",
                "constellations",
                "orbs",
                "plasma",
                "bubbles",
                "macscape",
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
          <Row className="gap-2 flex-wrap items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/40">
              Distortion
            </span>
            {(
              [
                "none",
                "crt",
                "scanlines",
                "grain",
                "vhs",
                "pixel-grid",
                "dither",
                "vignette",
                "bloom",
                "interlace",
              ] as const
            ).map((d) => (
              <button
                key={d}
                onClick={() => setDistortion(d)}
                className={`px-2 py-0.5 text-xs rounded border transition-colors ${
                  distortion === d
                    ? "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-100"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/5"
                }`}
              >
                {d}
              </button>
            ))}
            <label className="flex items-center gap-2 text-xs text-white/70 ml-2">
              dist. intensity
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={distIntensity}
                onChange={(e) => setDistIntensity(Number(e.target.value))}
              />
              <span className="tabular-nums font-mono w-10 text-right">
                {distIntensity.toFixed(2)}
              </span>
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
            {distortion !== "none" ? (
              <BackgroundDistortion
                preset={distortion}
                intensity={distIntensity}
              />
            ) : null}
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

      <Demo
        title="Distortion presets · all nine"
        hint="Same Aurora underneath. Each card adds one preset on top."
        wide
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {(
            [
              "crt",
              "scanlines",
              "grain",
              "vhs",
              "pixel-grid",
              "dither",
              "vignette",
              "bloom",
              "interlace",
            ] as DistortionPreset[]
          ).map((p) => (
            <div
              key={p}
              className="relative h-44 rounded-xl overflow-hidden border border-white/10 bg-[#0a0a10]"
            >
              <Aurora intensity={0.8} />
              <BackgroundDistortion preset={p} intensity={0.65} />
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/55 backdrop-blur-sm text-[10px] uppercase tracking-widest text-white/90">
                {p}
              </div>
            </div>
          ))}
        </div>
      </Demo>

      <Demo
        title="CRT · terminal vibes"
        hint="Scanlines + flicker + vignette over a Mesh"
        wide
      >
        <div className="relative h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a10]">
          <MeshGradient intensity={0.5} />
          <BackgroundDistortion preset="crt" intensity={0.75} />
          <div className="absolute inset-0 grid place-items-center">
            <div className="font-mono text-emerald-300 text-sm leading-relaxed text-center mix-blend-screen">
              <div>$ ssh prod-01.harbor</div>
              <div className="opacity-70">Last login: Fri Apr 24 2026</div>
              <div className="mt-2">harbor&gt; <span className="animate-pulse">_</span></div>
            </div>
          </div>
        </div>
      </Demo>

      <Demo
        title="VHS · tracking band drifts down"
        hint="RGB fringing + slow white sweep. Looks like a tape rewinding."
        wide
      >
        <div className="relative h-[300px] rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a10]">
          <Waves intensity={0.7} palette={["#f472b6", "#38bdf8", "#a855f7"]} />
          <BackgroundDistortion preset="vhs" intensity={0.7} />
        </div>
      </Demo>

      <Demo
        title="Pixel-grid · LCD phosphor feel"
        hint="4px cells tinted fuchsia. Great for retro-game hero areas."
      >
        <div className="relative h-[240px] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a10]">
          <PlasmaField intensity={0.8} />
          <BackgroundDistortion
            preset="pixel-grid"
            intensity={0.9}
            tint="#f0abfc"
          />
        </div>
      </Demo>

      <Demo
        title="Compose · grain + vignette"
        hint="Distortion layers stack. Grain adds texture; vignette frames it."
      >
        <div className="relative h-[240px] rounded-xl overflow-hidden border border-white/10 bg-[#0a0a10]">
          <MacScape layers={5} blur={10} />
          <BackgroundDistortion preset="grain" intensity={0.5} />
          <BackgroundDistortion preset="vignette" intensity={0.7} />
        </div>
      </Demo>

      <Demo title="All eight · side-by-side" wide>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          <MiniCard label="mesh">
            <MeshGradient />
          </MiniCard>
          <MiniCard label="aurora">
            <Aurora />
          </MiniCard>
          <MiniCard label="bubbles · metaballs">
            <Bubbles />
          </MiniCard>
          <MiniCard label="macscape">
            <MacScape />
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
          <MacScape layers={5} blur={10} />
          <Orbs count={6} glow={40} intensity={0.6} blend="plus-lighter" />
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
                Composed layers here: `MacScape` + additive `Orbs` for a
                bright ambient glow. Every layer lives behind the next.
              </p>
            </div>
          </div>
        </div>
      </Demo>

      <Demo title="Perf controls" hint="Every variant shares these props" wide>
        <Col className="gap-2 text-xs text-white/70 w-full">
          <pre className="font-mono text-[12px] text-white/85 bg-black/40 rounded-lg p-4 leading-relaxed overflow-x-auto whitespace-pre">
{`<AnimatedBackground
  variant="plasma"
  speed={1}              // 0 = frozen, 2+ = fast
  intensity={0.5}        // 0..1 (opacity / amplitude / density)
  palette={["#a855f7", ...]}
  paused={false}
  respectReducedMotion   // default true · static fallback
  pauseWhenHidden        // default true · document.hidden aware
  pauseWhenOutOfView     // default true · IntersectionObserver
/>`}
          </pre>
          <div className="grid md:grid-cols-2 gap-2 mt-2">
            <Bullet>CSS + rAF: <Code>mesh</Code>, <Code>orbs</Code></Bullet>
            <Bullet>SVG paths: <Code>aurora</Code>, <Code>waves</Code>, <Code>macscape</Code></Bullet>
            <Bullet>SVG + filter (metaballs): <Code>bubbles</Code></Bullet>
            <Bullet>Canvas 2D: <Code>constellations</Code>, <Code>plasma</Code></Bullet>
            <Bullet>Plasma renders at 1/8 resolution + CSS-blur upscale</Bullet>
            <Bullet><Code>mesh</Code> + <Code>bubbles</Code> bounce off the frame (no escapees)</Bullet>
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

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-fuchsia-200 font-mono text-[11px]">
      {children}
    </code>
  );
}
