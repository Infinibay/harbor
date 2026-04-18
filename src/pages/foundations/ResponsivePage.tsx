import { Group, Demo, Col, Row } from "../../showcase/ShowcaseCard";
import {
  Show,
  Hide,
  ResponsiveSwap,
  Container,
  ResponsiveStack,
  Button,
  Card,
  Badge,
} from "../../components";
import {
  useBreakpoint,
  useIsAbove,
  useResponsiveValue,
  useDevice,
  useOrientation,
  useIsTouch,
  useHasHover,
  usePrefersReducedMotion,
} from "../../lib/responsive";

export function ResponsivePage() {
  const bp = useBreakpoint();
  const isDesktop = useIsAbove("lg");
  const cols = useResponsiveValue({ base: 1, sm: 2, md: 3, xl: 4 });
  const device = useDevice();
  const orientation = useOrientation();
  const touch = useIsTouch();
  const hasHover = useHasHover();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <Group
      id="responsive"
      title="Responsive · breakpoints, hooks & tokens"
      desc="Hooks y componentes para animar cambios entre breakpoints. Todo construido sobre los design tokens de src/tokens.css."
    >
      <Demo title="Current viewport" hint="Cambiá el ancho o rotá el device." wide>
        <Col>
          <Row>
            <Badge tone="purple">bp: {bp}</Badge>
            <Badge tone={isDesktop ? "success" : "warning"}>
              {isDesktop ? "desktop" : "mobile"}
            </Badge>
            <Badge>cols: {cols}</Badge>
          </Row>
          <Row>
            <Badge tone="info">device: {device}</Badge>
            <Badge tone="purple">orientation: {orientation}</Badge>
            <Badge tone={touch ? "success" : "neutral"}>
              {touch ? "touch" : "mouse"}
            </Badge>
            <Badge tone={hasHover ? "success" : "neutral"}>
              hover: {hasHover ? "yes" : "no"}
            </Badge>
            {reducedMotion ? (
              <Badge tone="warning">reduced motion</Badge>
            ) : null}
          </Row>
        </Col>
      </Demo>

      <Demo title="Show — por device class" hint="phone / tablet / desktop." wide>
        <Col>
          <Show device="phone">
            <div className="rounded-lg bg-fuchsia-500/10 border border-fuchsia-400/30 px-3 py-2 text-sm text-fuchsia-200">
              📱 Solo en <strong>phone</strong> (&lt; 768px).
            </div>
          </Show>
          <Show device="tablet">
            <div className="rounded-lg bg-sky-500/10 border border-sky-400/30 px-3 py-2 text-sm text-sky-200">
              💠 Solo en <strong>tablet</strong> (768px – 1023px).
            </div>
          </Show>
          <Show device="desktop">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200">
              🖥️ Solo en <strong>desktop</strong> (≥ 1024px).
            </div>
          </Show>
          <Show device={["tablet", "desktop"]}>
            <div className="rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-white/75">
              Tablet + desktop (no mostrar en phone).
            </div>
          </Show>
        </Col>
      </Demo>

      <Demo title="Show — por orientation" hint="Rotá el device para ver el swap." wide>
        <Col>
          <Show orientation="portrait">
            <div className="rounded-lg bg-violet-500/15 border border-violet-400/30 px-3 py-2 text-sm text-violet-200">
              📐 Portrait — layout vertical.
            </div>
          </Show>
          <Show orientation="landscape">
            <div className="rounded-lg bg-amber-500/15 border border-amber-400/30 px-3 py-2 text-sm text-amber-200">
              📏 Landscape — layout horizontal.
            </div>
          </Show>
        </Col>
      </Demo>

      <Demo title="Show — touch vs mouse" hint="Oculta hovercards en touch." wide>
        <Col>
          <Show touch>
            <div className="rounded-lg bg-rose-500/10 border border-rose-400/30 px-3 py-2 text-sm text-rose-200">
              👆 Touch only — usá botones grandes, nada de hover.
            </div>
          </Show>
          <Show touch={false}>
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200">
              🖱️ Mouse only — hover previews activados.
            </div>
          </Show>
        </Col>
      </Demo>

      <Demo title="Show — above / below breakpoint" hint="Animado al cruzar el breakpoint." wide>
        <Col>
          <Show above="md">
            <div className="rounded-lg bg-emerald-500/10 border border-emerald-400/30 px-3 py-2 text-sm text-emerald-200">
              ✓ Visible above <code>md</code> (≥ 768px)
            </div>
          </Show>
          <Show below="md" animate="slide">
            <div className="rounded-lg bg-amber-500/10 border border-amber-400/30 px-3 py-2 text-sm text-amber-200">
              ✓ Visible below <code>md</code> (&lt; 768px)
            </div>
          </Show>
          <Hide above="lg">
            <div className="rounded-lg bg-rose-500/10 border border-rose-400/30 px-3 py-2 text-sm text-rose-200">
              ✗ Hidden above <code>lg</code>
            </div>
          </Hide>
        </Col>
      </Demo>

      <Demo title="ResponsiveSwap — mobile vs desktop variants" hint="Crossfade al cruzar md." wide>
        <ResponsiveSwap
          above="md"
          mobile={
            <div className="rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/10 border border-white/10 p-6 text-center">
              <div className="text-2xl mb-2">📱</div>
              <div className="text-white font-semibold">Mobile layout</div>
              <div className="text-sm text-white/55 mt-1">
                Single column, stacked actions
              </div>
            </div>
          }
          desktop={
            <div className="rounded-xl bg-gradient-to-br from-sky-500/20 to-emerald-500/10 border border-white/10 p-6 grid grid-cols-2 gap-4">
              <div className="col-span-1 text-white">
                <div className="text-2xl mb-2">🖥️</div>
                <div className="font-semibold">Desktop layout</div>
                <div className="text-sm text-white/55 mt-1">
                  Multiple columns, inline actions
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
              </div>
            </div>
          }
        />
      </Demo>

      <Demo title="ResponsiveStack — direction per breakpoint" wide>
        <ResponsiveStack
          direction={{ base: "col", md: "row" }}
          gap={{ base: 2, md: 4 }}
          className="w-full"
        >
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-1 text-center">
              <div className="text-white font-semibold">Item {i}</div>
              <div className="text-xs text-white/45 mt-1">
                col on mobile · row on md+
              </div>
            </Card>
          ))}
        </ResponsiveStack>
      </Demo>

      <Demo title="Container — breakpoint-aware widths" wide>
        <Col>
          {(["sm", "md", "lg", "xl", "prose"] as const).map((s) => (
            <Container key={s} size={s} padded={false}>
              <div className="rounded bg-white/5 border border-white/10 px-3 py-2 text-xs text-white/70 font-mono">
                Container size="{s}"
              </div>
            </Container>
          ))}
        </Col>
      </Demo>

      <Demo title="Tokens — live preview" hint="Cambia --harbor-accent → todo sigue." wide>
        <Col>
          <div className="flex flex-wrap gap-3">
            {(["default", "cyan", "emerald", "rose"] as const).map((t) => {
              const override =
                t === "cyan"
                  ? { "--harbor-accent": "34 211 238" }
                  : t === "emerald"
                    ? { "--harbor-accent": "52 211 153" }
                    : t === "rose"
                      ? { "--harbor-accent": "244 63 94" }
                      : {};
              return (
                <div
                  key={t}
                  style={override as React.CSSProperties}
                  className="rounded-xl border border-white/10 p-4 flex flex-col gap-2 min-w-[160px]"
                >
                  <div className="text-xs uppercase tracking-wider text-white/45">
                    {t}
                  </div>
                  <div
                    className="h-8 rounded"
                    style={{ background: "rgb(var(--harbor-accent))" }}
                  />
                  <button
                    className="text-sm text-white rounded px-3 py-1.5"
                    style={{
                      background: "rgb(var(--harbor-accent) / 0.85)",
                    }}
                  >
                    Button
                  </button>
                  <div
                    className="text-xs"
                    style={{ color: "rgb(var(--harbor-accent))" }}
                  >
                    Accent text
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-white/45">
            Cada card override <code>--harbor-accent</code> en su propio
            subtree. Todos los botones, texto y borders que usen esa var se
            actualizan instantáneamente.
          </p>
        </Col>
      </Demo>

      <Demo title="Token reference" hint="Lista completa en src/tokens.css." wide>
        <div className="w-full font-mono text-xs text-white/70 overflow-auto">
          <pre className="whitespace-pre">{`--harbor-accent      168 85 247    (rgb triplet)
--harbor-accent-2    56 189 248
--harbor-success     52 211 153
--harbor-warning     251 191 36
--harbor-danger      244 63 94

--harbor-bg          10 10 15
--harbor-bg-elev-1   18 18 26
--harbor-bg-elev-2   28 28 38
--harbor-bg-elev-3   38 38 50

--harbor-text        255 255 255
--harbor-text-muted  170 170 180

--harbor-radius-sm   6px       --harbor-radius-xl   20px
--harbor-radius-md   10px      --harbor-radius-2xl  28px
--harbor-radius-lg   14px

--harbor-dur-fast    150ms     --harbor-dur-slow    420ms
--harbor-dur-base    260ms     --harbor-dur-slower  620ms
--harbor-ease-out    cubic-bezier(0.22, 0.7, 0.2, 1)
--harbor-ease-spring cubic-bezier(0.3, 1.4, 0.4, 1)

--harbor-bp-sm   640    --harbor-bp-lg   1024    --harbor-bp-2xl  1536
--harbor-bp-md   768    --harbor-bp-xl   1280`}</pre>
        </div>
      </Demo>
    </Group>
  );
}
