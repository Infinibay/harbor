import { useRef, useState } from "react";
import { Group, Demo, Row, Col } from "../../showcase/ShowcaseCard";
import { MorphBar, MorphItem } from "../../components";
import { ExpandingSearch } from "../../components";
import { NotificationBell } from "../../components";
import { Avatar } from "../../components";
import { Button } from "../../components";
import { FilterBar, type AppliedFilter } from "../../components";
import { PeekCard, PeekGrid } from "../../components";
import { Callout } from "../../components";
import { Marquee } from "../../components";
import { ParallaxGroup, ParallaxLayer } from "../../components";
import { Badge } from "../../components";

export function CoordinationPage() {
  const [toolbarSearchOpen, setToolbarSearchOpen] = useState(false);
  const [toolbarQ, setToolbarQ] = useState("");
  const [filters, setFilters] = useState<AppliedFilter[]>([]);
  const [notifsUnread, setNotifsUnread] = useState([
    { id: "1", unread: true },
    { id: "2", unread: true },
    { id: "3", unread: false },
  ]);

  return (
    <Group
      id="patterns"
      title="Patterns · componentes que se coordinan"
      desc="MorphBar, Expandable, FilterBar — componentes que reaccionan entre sí."
    >
      <Demo title="Adaptive toolbar" hint="La lupa expande, los hermanos ceden." wide intensity="soft">
        <MorphBar className="w-full rounded-2xl bg-white/5 border border-white/10 px-3 py-2">
          <MorphItem id="brand" hidden={toolbarSearchOpen} className="font-semibold text-white text-sm">
            Infinibay
          </MorphItem>
          <MorphItem id="tabs" hidden={toolbarSearchOpen}>
            <Row className="gap-1">
              <Button size="sm" variant="ghost">
                Services
              </Button>
              <Button size="sm" variant="ghost">
                Deploys
              </Button>
              <Button size="sm" variant="ghost">
                Logs
              </Button>
            </Row>
          </MorphItem>
          <MorphItem id="search" grow={toolbarSearchOpen ? 1 : 0}>
            <ExpandingSearch
              open={toolbarSearchOpen}
              onOpenChange={setToolbarSearchOpen}
              value={toolbarQ}
              onChange={setToolbarQ}
              autoCollapseOnEmpty
            />
          </MorphItem>
          <MorphItem id="notif" hidden={toolbarSearchOpen}>
            <NotificationBell
              notifications={[
                { id: "1", title: "Deploy successful", description: "api-gateway v2.3.0 is live.", time: "2m ago", unread: notifsUnread[0].unread },
                { id: "2", title: "High CPU on node-08", description: "Above 85% for 5 minutes.", time: "12m ago", unread: notifsUnread[1].unread },
                { id: "3", title: "Invited Ana F.", time: "yesterday", unread: notifsUnread[2].unread },
              ]}
              onRead={(id) =>
                setNotifsUnread((ns) => ns.map((n) => (n.id === id ? { ...n, unread: false } : n)))
              }
              onReadAll={() => setNotifsUnread((ns) => ns.map((n) => ({ ...n, unread: false })))}
            />
          </MorphItem>
          <MorphItem id="avatar" hidden={toolbarSearchOpen}>
            <Avatar name="Andrés" status="online" interactive />
          </MorphItem>
        </MorphBar>
      </Demo>
      <Demo title="FilterBar" hint="Chips reflowing." wide intensity="soft">
        <FilterBar
          applied={filters}
          onChange={setFilters}
          filters={[
            { id: "status", label: "Status", options: ["Running", "Failed", "Pending"] },
            { id: "env", label: "Env", options: ["Dev", "Staging", "Prod"] },
            { id: "region", label: "Region", options: ["EU", "US", "APAC"] },
          ]}
        />
      </Demo>
      <Demo title="Callout / product tour" hint="Highlight + dim + popover paso a paso." wide intensity="soft">
        <TourDemo />
      </Demo>

      <Demo
        title="Marquee · ribbon infinito con hover-pause"
        hint="Fade en los bordes, una copia se mide y se duplica hasta llenar"
        wide
        intensity="soft"
      >
        <Marquee speed={60} gap={48} className="py-4">
          {["Nix", "Kubernetes", "Terraform", "Prometheus", "Grafana", "ClickHouse", "Redis", "Postgres", "NATS"].map((name) => (
            <span
              key={name}
              className="text-lg text-white/65 font-mono tracking-tight hover:text-white transition-colors"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </Demo>

      <Demo
        title="ParallaxGroup · capas que reaccionan al cursor"
        hint="Cada capa se mueve a su profundidad · un solo listener global"
        wide
        intensity="soft"
      >
        <ParallaxGroup strength={28} className="h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500/10 via-violet-500/5 to-sky-500/10 border border-white/10 flex items-center justify-center">
          <ParallaxLayer depth={0.15} className="absolute inset-0 flex items-center justify-start pl-10">
            <div className="w-40 h-40 rounded-full bg-fuchsia-500/20 blur-2xl" />
          </ParallaxLayer>
          <ParallaxLayer depth={0.3} className="absolute inset-0 flex items-center justify-end pr-14">
            <div className="w-52 h-52 rounded-full bg-sky-500/20 blur-3xl" />
          </ParallaxLayer>
          <ParallaxLayer depth={0.6} className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col gap-2 items-center">
              <Badge>Infinibay · v0.1</Badge>
              <div className="text-white/30 text-xs">back layer</div>
            </div>
          </ParallaxLayer>
          <ParallaxLayer depth={1.2} tilt={0.4} className="relative z-10">
            <div className="px-8 py-5 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md shadow-[0_30px_60px_-20px_rgba(168,85,247,0.35)]">
              <div className="text-white text-xl font-semibold">Living cards</div>
              <div className="text-white/50 text-sm mt-1">Move your cursor around.</div>
            </div>
          </ParallaxLayer>
          <ParallaxLayer depth={-0.4} className="absolute top-6 right-8">
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              foreground · negative depth
            </div>
          </ParallaxLayer>
        </ParallaxGroup>
      </Demo>

      <Demo title="PeekCard grid" hint="Hover → expande. Grid reacomoda." wide intensity="soft">
        <PeekGrid cols={3}>
          {[
            { t: "api-gateway", d: "10 pods · healthy", more: "Last deploy 4h ago · p95 84ms · 0 rollbacks" },
            { t: "auth-service", d: "3 pods · degraded", more: "Error rate 2.4% · investigate with logs →" },
            { t: "worker-pool", d: "12 pods · healthy", more: "Queue depth 128 · processed 41k today" },
          ].map((c) => (
            <PeekCard key={c.t} title={c.t} description={c.d} more={c.more} />
          ))}
        </PeekGrid>
      </Demo>
    </Group>
  );
}

function TourDemo() {
  const [step, setStep] = useState(0);
  const b1 = useRef<HTMLButtonElement | null>(null);
  const b2 = useRef<HTMLButtonElement | null>(null);
  const b3 = useRef<HTMLButtonElement | null>(null);
  const refs = [b1, b2, b3];

  const steps = [
    { title: "Your dashboard", desc: "Every service you run shows up here, live." },
    { title: "Deploy button", desc: "One click to ship — rollbacks are automatic." },
    { title: "Help & shortcuts", desc: "Press ? anywhere to see all keyboard shortcuts." },
  ];
  const open = step > 0;

  return (
    <Col>
      <Row>
        <button ref={b1} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white/85">
          Dashboard
        </button>
        <button ref={b2} className="px-3 py-1.5 rounded-lg bg-fuchsia-500/80 text-sm text-white">
          Deploy
        </button>
        <button ref={b3} className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-sm text-white/80">
          ?
        </button>
      </Row>
      <Row>
        <Button size="sm" variant="secondary" onClick={() => setStep(1)}>
          Start tour
        </Button>
      </Row>
      <Callout
        open={open}
        target={open ? refs[step - 1]?.current ?? null : null}
        step={step}
        total={steps.length}
        title={open ? steps[step - 1].title : undefined}
        placement={step === 3 ? "left" : "bottom"}
        onPrev={step > 1 ? () => setStep((s) => s - 1) : undefined}
        onNext={step < steps.length ? () => setStep((s) => s + 1) : () => setStep(0)}
        onClose={() => setStep(0)}
      >
        {open ? steps[step - 1].desc : null}
      </Callout>
    </Col>
  );
}
