import { useEffect, useMemo, useRef, useState } from "react";
import { Group, Demo, Col, Row } from "../../showcase/ShowcaseCard";
import { Stat } from "../../components";
import { Card, CardGrid } from "../../components";
import { ProgressRing } from "../../components";
import { Progress } from "../../components";
import { HeatmapCalendar } from "../../components";
import { Timeline } from "../../components";
import { Badge } from "../../components";
import { Sparkline } from "../../components";
import { LineChart } from "../../components";
import { BarChart } from "../../components";
import { Donut } from "../../components";
import { Gauge } from "../../components";
import { CountUp } from "../../components";
import { Button } from "../../components";
import {
  FlameGraph,
  MetricHeatmap,
  TimeSeriesChart,
  TimeSeriesMarker,
  TraceWaterfall,
  type Span,
} from "../../components";
import {
  LogTailer,
  type LogTailerHandle,
  type LogEntry,
} from "../../components";
import {
  TimeRangePicker,
  ThresholdRuleBuilder,
  emptyGroup,
  type RuleNode,
  type TimeRangeValue,
} from "../../components";
import {
  BillingCard,
  CostBreakdown,
  QuotaBar,
  ResourceForecast,
  UsageRing,
} from "../../components";

export function DashboardPage() {
  const [live, setLive] = useState(12400);
  useEffect(() => {
    const t = setInterval(() => setLive((v) => v + Math.round((Math.random() - 0.4) * 120)), 1200);
    return () => clearInterval(t);
  }, []);

  const lineData = useMemo(() => ({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    signups: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, Math.round(60 + 40 * Math.sin(i / 3) + Math.random() * 20)),
    ),
    active: Array.from({ length: 24 }, (_, i) =>
      Math.max(0, Math.round(120 + 60 * Math.sin(i / 4 + 1) + Math.random() * 30)),
    ),
  }), []);

  const weeklyBars = useMemo(
    () =>
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
        id: d,
        label: d,
        value: 80 + Math.round(Math.random() * 120) + i * 10,
      })),
    [],
  );

  const sparkSet = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => 50 + Math.sin(i / 2) * 20 + Math.random() * 10),
    [],
  );

  const heatData = useMemo(() => {
    const d: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 140; i++) {
      const dt = new Date(today);
      dt.setDate(dt.getDate() - i);
      d[dt.toISOString().slice(0, 10)] = Math.max(0, Math.round(Math.random() * 8 - 2));
    }
    return d;
  }, []);

  return (
    <Group id="dashboard" title="Dashboard · analytics" desc="KPIs, charts, rings, heatmap, activity.">
      <Demo title="Live requests (CountUp)" hint="Actualiza cada 1.2s.">
        <Col>
          <div className="text-4xl font-semibold text-white">
            <CountUp value={live} />
          </div>
          <div className="text-xs text-white/55">req / minute</div>
          <Sparkline data={sparkSet} width={180} height={38} />
        </Col>
      </Demo>

      <Demo title="KPIs" wide>
        <CardGrid cols={4} className="w-full">
          <Stat label="Revenue" value={91230} prefix="$" change={8} format={(n) => n.toLocaleString()} />
          <Stat label="Active users" value={12482} change={4} />
          <Stat label="Conversions" value={342} change={-2} />
          <Stat label="Refunds" value={12} change={-40} />
        </CardGrid>
      </Demo>

      <Demo title="Progress rings" wide>
        <CardGrid cols={4} className="w-full">
          <Card>
            <Col>
              <ProgressRing value={72} />
              <div className="text-center text-xs text-white/55 mt-2">Goal 72%</div>
            </Col>
          </Card>
          <Card>
            <Col>
              <ProgressRing value={48} tone="amber" />
              <div className="text-center text-xs text-white/55 mt-2">Budget</div>
            </Col>
          </Card>
          <Card>
            <Col>
              <ProgressRing value={93} tone="green" />
              <div className="text-center text-xs text-white/55 mt-2">Uptime</div>
            </Col>
          </Card>
          <Card>
            <Col>
              <ProgressRing value={18} tone="rose" />
              <div className="text-center text-xs text-white/55 mt-2">Errors</div>
            </Col>
          </Card>
        </CardGrid>
      </Demo>

      <Demo title="Capacity bars" wide>
        <Col>
          <Progress value={82} label="CPU" showValue shimmer />
          <Progress value={54} label="Memory" tone="sky" showValue />
          <Progress value={31} label="Disk" tone="green" showValue />
          <Progress value={96} label="Network" tone="rose" showValue />
        </Col>
      </Demo>

      <Demo title="Line chart — 24h" hint="Hover para ver valores." wide>
        <LineChart
          labels={lineData.labels}
          series={[
            { id: "signups", label: "Signups", color: "#a855f7", data: lineData.signups },
            { id: "active", label: "Active", color: "#38bdf8", data: lineData.active },
          ]}
          height={240}
          area
        />
      </Demo>

      <Demo title="Bar chart — weekly" wide>
        <BarChart bars={weeklyBars} height={220} />
      </Demo>

      <Demo title="Traffic breakdown" wide>
        <Donut
          slices={[
            { id: "direct", label: "Direct", value: 42 },
            { id: "search", label: "Search", value: 28 },
            { id: "referral", label: "Referral", value: 18 },
            { id: "social", label: "Social", value: 12 },
          ]}
          centerLabel="Total"
          centerValue="100%"
        />
      </Demo>

      <Demo title="Gauges" wide>
        <Row>
          <Gauge value={72} label="CPU" unit="%" />
          <Gauge value={48} label="Memory" unit="%" />
          <Gauge value={91} label="Disk" unit="%" />
        </Row>
      </Demo>

      <Demo title="Sparklines inline" wide>
        <Col>
          {["api-gateway", "auth-service", "worker-pool", "billing"].map((s, i) => (
            <Row key={s} className="items-center justify-between">
              <span className="text-sm text-white/75 w-40">{s}</span>
              <Sparkline
                data={Array.from({ length: 20 }, () => Math.random() * 100)}
                width={160}
                height={28}
                stroke={["#a855f7", "#38bdf8", "#f472b6", "#34d399"][i]}
              />
              <span className="text-sm font-mono text-white/75 tabular-nums w-16 text-right">
                <CountUp value={Math.round(Math.random() * 500 + 100)} />
              </span>
            </Row>
          ))}
        </Col>
      </Demo>

      <Demo title="Activity heatmap" wide>
        <HeatmapCalendar data={heatData} weeks={24} />
      </Demo>

      <Demo title="Recent activity" wide>
        <Timeline
          events={[
            { id: "1", title: "Deploy succeeded", description: "v2.3.0 · api-gateway", time: "2m ago", tone: "success" },
            { id: "2", title: "New signup", description: "sofia@acme.co", time: "6m ago", tone: "info" },
            { id: "3", title: "Refund issued", description: "order #4582", time: "18m ago", tone: "warning" },
            { id: "4", title: "Daily report", description: "mailed to owners", time: "4h ago", tone: "neutral" },
          ]}
        />
      </Demo>

      <Demo title="Status overview">
        <Col>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">api-gateway</span>
            <Badge tone="success" pulse>healthy</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">auth-service</span>
            <Badge tone="warning" pulse>degraded</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">worker-pool</span>
            <Badge tone="success">healthy</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-white/70">billing</span>
            <Badge tone="success">healthy</Badge>
          </div>
        </Col>
      </Demo>

      <ObservabilityPackDemo />
      <BillingPackDemo />
    </Group>
  );
}

// === Pack 7: billing demos ======================================

function BillingPackDemo() {
  const cpuForecast = useMemo(() => {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => ({
      t: now - (30 - i) * 3600_000,
      v: 42 + i * 1.1 + Math.sin(i / 3) * 3 + Math.random() * 2,
    }));
  }, []);

  return (
    <>
      <Demo title="UsageRing · tone shifts at 75% / 90%" wide intensity="soft">
        <Row className="gap-6 flex-wrap">
          <UsageRing value={18} max={100} name="CPU" />
          <UsageRing value={62} max={100} name="RAM" />
          <UsageRing value={81} max={100} name="Disk" caption="projected to hit 100% in 4d" />
          <UsageRing value={94} max={100} name="Egress" caption="2.7 TB / 2.9 TB" />
        </Row>
      </Demo>

      <Demo
        title="QuotaBar · used / reserved / free segments"
        hint="Soft + hard limits as vertical lines"
        wide
        intensity="soft"
      >
        <Col className="gap-3 w-full">
          <QuotaBar
            total={160}
            segments={[
              { label: "Running VMs", value: 62, tone: "used" },
              { label: "Reserved pool", value: 28, tone: "reserved" },
            ]}
            soft={0.75}
            hard={1}
            formatValue={(v) => `${v} vCPU`}
          />
          <QuotaBar
            total={2000}
            segments={[
              { label: "Billed storage", value: 1180, tone: "used" },
              { label: "Snapshot pool", value: 340, tone: "reserved" },
            ]}
            formatValue={(v) => `${v} GB`}
          />
        </Col>
      </Demo>

      <Demo title="CostBreakdown · donut + legend" wide intensity="soft">
        <CostBreakdown
          items={[
            { id: "compute", label: "Compute", amount: 1240 },
            { id: "storage", label: "Storage", amount: 380 },
            { id: "egress", label: "Egress", amount: 210 },
            { id: "support", label: "Support", amount: 120 },
            { id: "misc", label: "Misc.", amount: 60 },
          ]}
        />
      </Demo>

      <Demo title="BillingCard" hint="Plan summary · composes QuotaBar" wide intensity="soft">
        <BillingCard
          plan="Team"
          price="$49/mo"
          period={{
            start: new Date("2026-04-01"),
            end: new Date("2026-04-30"),
          }}
          usage={{
            total: 100,
            label: "CPU hours · 62 / 100",
            segments: [
              { label: "Used", value: 62, tone: "used" },
              { label: "Reserved", value: 12, tone: "reserved" },
            ],
          }}
          nextInvoice="$67.20"
          cta={
            <Button size="sm" variant="primary">
              Upgrade
            </Button>
          }
        />
      </Demo>

      <Demo
        title="ResourceForecast · linear projection + quota marker"
        hint="Dashed extension past 'now' · marks where it crosses the quota"
        wide
        intensity="soft"
      >
        <ResourceForecast
          height={260}
          quota={90}
          series={[
            { id: "cpu", label: "CPU %", color: "#a855f7", data: cpuForecast },
          ]}
          formatY={(v) => `${v.toFixed(0)}%`}
        />
      </Demo>
    </>
  );
}

// === Pack 2: observability demos ================================

function genSeries(n: number, base: number, noise: number, sway: number) {
  const now = Date.now();
  return Array.from({ length: n }, (_, i) => ({
    t: now - (n - i) * 60_000,
    v: base + sway * Math.sin(i / 5) + (Math.random() - 0.5) * noise,
  }));
}

function ObservabilityPackDemo() {
  const [range, setRange] = useState<TimeRangeValue>({ preset: "1h" });
  const [brushed, setBrushed] = useState<{ from: Date; to: Date } | null>(null);

  const cpuSeries = useMemo(() => genSeries(60, 52, 8, 14), []);
  const reqSeries = useMemo(() => genSeries(60, 320, 60, 80), []);
  const errSeries = useMemo(() => genSeries(60, 6, 4, 3), []);

  const [rule, setRule] = useState<RuleNode>(() => ({
    ...emptyGroup("and"),
    children: [
      {
        kind: "condition",
        id: "c1",
        metric: "cpu",
        op: ">",
        value: 85,
        forSeconds: 120,
      },
      {
        kind: "condition",
        id: "c2",
        metric: "errors",
        op: ">",
        value: 3,
        forSeconds: 60,
      },
    ],
  }));

  return (
    <>
      <Demo
        title="TimeSeriesChart · brush to zoom + markers"
        hint="Drag on the chart to select a range · crosshair + tooltip"
        wide
        intensity="soft"
      >
        <Col className="gap-3 w-full">
          <Row className="gap-3 items-center">
            <TimeRangePicker value={range} onChange={(v) => setRange(v)} />
            <span className="text-xs text-white/40 tabular-nums font-mono">
              {brushed
                ? `selected: ${brushed.from.toLocaleTimeString()} → ${brushed.to.toLocaleTimeString()}`
                : "drag across chart to select"}
            </span>
          </Row>
          <TimeSeriesChart
            height={260}
            onRangeSelect={(r) => setBrushed(r)}
            series={[
              { id: "cpu", label: "CPU %", color: "#a855f7", data: cpuSeries },
              { id: "req", label: "req/s", color: "#38bdf8", data: reqSeries },
            ]}
            formatY={(v) => `${v.toFixed(0)}`}
          >
            <TimeSeriesMarker
              at={Date.now() - 20 * 60_000}
              label="deploy api-gateway"
              color="#34d399"
            />
            <TimeSeriesMarker
              at={Date.now() - 8 * 60_000}
              label="incident"
              color="#f43f5e"
              stroke="solid"
            />
          </TimeSeriesChart>
        </Col>
      </Demo>

      <Demo
        title="LogTailer · streaming with follow mode"
        hint="Click pause chip + scroll up to stop following · search + regex + level filter"
        wide
        intensity="soft"
      >
        <LogTailerDemo />
      </Demo>

      <Demo
        title="MetricHeatmap · hour × day"
        hint="Latency p95 per hour across a week"
        wide
        intensity="soft"
      >
        <MetricHeatmap
          rows={[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ]}
          cols={Array.from({ length: 24 }, (_, i) => `${i}h`)}
          cells={Array.from({ length: 7 * 24 }, (_, i) => ({
            r: Math.floor(i / 24),
            c: i % 24,
            v:
              40 +
              30 * Math.abs(Math.sin((i / 24) * Math.PI + Math.floor(i / 24) * 0.6)) +
              (Math.random() - 0.5) * 20,
          }))}
          formatV={(v) => `${v.toFixed(0)}ms`}
        />
      </Demo>

      <Demo
        title="FlameGraph · click to zoom"
        hint="Hover highlights ancestors · click zooms into subtree"
        wide
        intensity="soft"
      >
        <FlameGraph
          formatValue={(v) => `${v.toFixed(0)}ms`}
          frames={[
            { id: "req", label: "handle /api/deploy", value: 840 },
            { id: "auth", parent: "req", label: "auth.verify", value: 120 },
            { id: "load", parent: "req", label: "db.load", value: 320 },
            { id: "q1", parent: "load", label: "SELECT project", value: 150 },
            { id: "q2", parent: "load", label: "SELECT members", value: 80 },
            { id: "q3", parent: "load", label: "SELECT artifacts", value: 90 },
            { id: "proc", parent: "req", label: "process", value: 280 },
            { id: "val", parent: "proc", label: "validate", value: 60 },
            { id: "tx", parent: "proc", label: "tx.begin", value: 12 },
            { id: "apply", parent: "proc", label: "apply changes", value: 180 },
            { id: "resp", parent: "req", label: "serialize", value: 120 },
          ]}
        />
      </Demo>

      <Demo
        title="TraceWaterfall"
        hint="Nested spans · click to drill · time axis across top"
        wide
        intensity="soft"
      >
        <TraceWaterfall
          totalMs={420}
          spans={[
            { id: "a", name: "POST /api/deploy", start: 0, duration: 420 },
            { id: "b", parent: "a", name: "auth.verify", start: 10, duration: 80, status: "ok" },
            { id: "c", parent: "a", name: "db.load project", start: 100, duration: 120, status: "ok" },
            { id: "d", parent: "c", name: "  cache.lookup", start: 105, duration: 14, status: "ok" },
            { id: "e", parent: "c", name: "  SELECT project", start: 120, duration: 90, status: "ok" },
            { id: "f", parent: "a", name: "queue.enqueue", start: 230, duration: 40, status: "pending" },
            { id: "g", parent: "a", name: "serialize", start: 280, duration: 140, status: "error" },
          ] as Span[]}
        />
      </Demo>

      <Demo
        title="ThresholdRuleBuilder"
        hint="Visual AND/OR composition for alert rules"
        wide
        intensity="soft"
      >
        <Col className="gap-3 w-full">
          <ThresholdRuleBuilder
            value={rule}
            onChange={setRule}
            metrics={[
              { value: "cpu", label: "CPU %", unit: "%" },
              { value: "ram", label: "RAM %", unit: "%" },
              { value: "disk", label: "Disk %", unit: "%" },
              { value: "req", label: "Requests / sec", unit: "req/s" },
              { value: "errors", label: "Errors / min", unit: "/min" },
              { value: "latency", label: "Latency p95", unit: "ms" },
            ]}
          />
          <pre className="text-[10px] text-white/50 bg-white/[0.03] rounded p-3 overflow-auto font-mono max-h-40">
            {JSON.stringify(rule, null, 2)}
          </pre>
        </Col>
      </Demo>
      {/* suppress unused */}
      <div className="hidden">{Boolean(errSeries)}</div>
    </>
  );
}

function LogTailerDemo() {
  const tailerRef = useRef<LogTailerHandle>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const levels: LogEntry["level"][] = ["debug", "info", "info", "info", "warn", "error"];
      const sources = ["api", "worker", "scheduler", "auth", "db"];
      const messages = [
        "request completed in 34ms",
        "cache miss for key user:1234",
        "migration 0042 applied",
        "connection pool exhausted",
        "retrying upstream after 502",
        "heartbeat ok · 12 pods",
        "auth token refreshed",
        "slow query 430ms: SELECT * FROM events",
      ];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const entry: LogEntry = {
        id: `e${Date.now()}${Math.random()}`,
        time: new Date(),
        level,
        source: sources[Math.floor(Math.random() * sources.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
      };
      tailerRef.current?.append(entry);
    }, 400);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <Col className="w-full gap-3">
      <Row className="gap-2">
        <Button size="sm" variant={paused ? "primary" : "ghost"} onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume stream" : "Pause stream"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => tailerRef.current?.clear()}>
          Clear
        </Button>
        <Button size="sm" variant="ghost" onClick={() => tailerRef.current?.scrollToBottom()}>
          Scroll to bottom
        </Button>
      </Row>
      <LogTailer ref={tailerRef} height={320} />
    </Col>
  );
}
