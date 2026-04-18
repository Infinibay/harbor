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
