import { useEffect, useMemo, useState } from "react";
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
    </Group>
  );
}
