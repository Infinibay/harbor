import { useState } from "react";
import { Group, Demo, Col, Row } from "../../showcase/ShowcaseCard";
import {
  ClusterView,
  DatacenterRow,
  LiveMigrationIndicator,
  NetworkGraph,
  RackDiagram,
  type ClusterHost,
  type GraphEdge,
  type GraphNode,
  type RackHost,
} from "../../components";
import { Button } from "../../components";

const CLUSTER_HOSTS: ClusterHost[] = [
  { id: "h1", name: "api-gateway-01", status: "online", subtitle: "Ubuntu 24.04 · 8 vCPU", cpu: 42, ram: { used: 11.8, total: 16 }, disk: { used: 180, total: 500 }, tags: ["prod", "edge"], region: "eu-west-1" },
  { id: "h2", name: "api-gateway-02", status: "online", subtitle: "Ubuntu 24.04 · 8 vCPU", cpu: 56, ram: { used: 9.4, total: 16 }, disk: { used: 160, total: 500 }, tags: ["prod", "edge"], region: "eu-west-1" },
  { id: "h3", name: "worker-db-01", status: "degraded", subtitle: "PostgreSQL primary", cpu: 88, ram: { used: 14.2, total: 16 }, disk: { used: 450, total: 500 }, tags: ["prod", "db"], region: "eu-west-1" },
  { id: "h4", name: "worker-db-02", status: "online", subtitle: "PostgreSQL replica", cpu: 74, ram: { used: 12.1, total: 16 }, disk: { used: 420, total: 500 }, tags: ["prod", "db"], region: "eu-west-1" },
  { id: "h5", name: "cache-01", status: "online", subtitle: "Redis 7.2", cpu: 14, ram: { used: 6.2, total: 8 }, tags: ["prod"], region: "eu-west-1" },
  { id: "h6", name: "cache-02", status: "online", subtitle: "Redis 7.2", cpu: 18, ram: { used: 6.8, total: 8 }, tags: ["prod"], region: "us-east-1" },
  { id: "h7", name: "build-runner-01", status: "provisioning", subtitle: "NixOS · ephemeral", cpu: 2, ram: { used: 0.8, total: 8 }, tags: ["ci"], region: "eu-west-1" },
  { id: "h8", name: "legacy-billing", status: "offline", subtitle: "CentOS 7 · decommission", tags: ["legacy"], region: "us-east-1" },
  { id: "h9", name: "staging-all-in-one", status: "online", subtitle: "Dev cluster", cpu: 22, ram: { used: 3.4, total: 8 }, tags: ["staging"], region: "eu-west-1" },
];

const GRAPH_NODES: GraphNode[] = [
  { id: "edge", label: "Edge LB", status: "online", group: "net" },
  { id: "api1", label: "api-gw-01", status: "online", group: "app" },
  { id: "api2", label: "api-gw-02", status: "online", group: "app" },
  { id: "auth", label: "auth", status: "degraded", group: "app" },
  { id: "db1", label: "db-primary", status: "online", group: "data" },
  { id: "db2", label: "db-replica", status: "online", group: "data" },
  { id: "cache", label: "redis", status: "online", group: "data" },
  { id: "queue", label: "nats", status: "online", group: "data" },
  { id: "worker", label: "worker", status: "online", group: "app" },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: "edge", to: "api1", animated: true },
  { from: "edge", to: "api2", animated: true },
  { from: "api1", to: "auth" },
  { from: "api2", to: "auth" },
  { from: "api1", to: "db1", label: "read/write" },
  { from: "api2", to: "db2" },
  { from: "api1", to: "cache" },
  { from: "api2", to: "cache" },
  { from: "api1", to: "queue" },
  { from: "queue", to: "worker", animated: true },
  { from: "worker", to: "db1" },
];

const RACK_A_HOSTS: RackHost[] = [
  { u: 1, height: 2, name: "patch-panel", status: "online", color: "rgba(120,120,130,0.2)" },
  { u: 3, name: "api-gateway-01", status: "online", subtitle: "Ubuntu 24.04" },
  { u: 4, name: "api-gateway-02", status: "online" },
  { u: 5, name: "worker-db-01", status: "degraded", subtitle: "pg-primary" },
  { u: 6, name: "worker-db-02", status: "online" },
  { u: 8, height: 2, name: "cache-cluster", status: "online", subtitle: "redis 7.2 · 6 nodes" },
  { u: 10, name: "build-runner-01", status: "provisioning" },
  { u: 12, name: "legacy-billing", status: "offline" },
  { u: 14, height: 4, name: "SAN-shelf-A", status: "online", subtitle: "12 × 18 TB" },
];

const RACK_B_HOSTS: RackHost[] = [
  { u: 1, height: 2, name: "patch-panel", color: "rgba(120,120,130,0.2)" },
  { u: 3, name: "staging-all-in-one", status: "online" },
  { u: 4, name: "monitoring-01", status: "online" },
  { u: 6, name: "storage-01", status: "online", subtitle: "ceph-osd" },
  { u: 7, name: "storage-02", status: "online" },
  { u: 8, name: "storage-03", status: "online" },
  { u: 9, name: "storage-04", status: "online" },
];

export function InfraPage() {
  return (
    <Group
      id="infra"
      title="Infra"
      desc="Topology · cluster view · rack diagrams · live migrations — the Infinibay-flavored infra pack."
    >
      <Demo
        title="NetworkGraph · force-directed + standalone"
        hint="Drag empty to pan · wheel to zoom · drag a node to pin · shift+drag to release"
        wide
        intensity="soft"
      >
        <NetworkGraph nodes={GRAPH_NODES} edges={GRAPH_EDGES} />
      </Demo>

      <Demo
        title="ClusterView · filter chips + density toggle"
        hint="FluidGrid of HostCards with status / region / tag filters"
        wide
        intensity="soft"
      >
        <ClusterView
          hosts={CLUSTER_HOSTS}
          header={
            <Row className="justify-between items-baseline">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-white/40">
                  production
                </div>
                <div className="text-white text-xl font-semibold">
                  Fleet · {CLUSTER_HOSTS.length} hosts
                </div>
              </div>
              <Button size="sm" variant="primary">
                Provision
              </Button>
            </Row>
          }
          onHostClick={(h) => console.info("click", h.name)}
        />
      </Demo>

      <Demo
        title="LiveMigrationIndicator"
        hint="Source → destination arrow with live progress + ETA"
        wide
        intensity="soft"
      >
        <MigrationDemo />
      </Demo>

      <Demo
        title="RackDiagram · single rack"
        hint="Hover to highlight · click a slot → onHostClick"
        wide
        intensity="soft"
      >
        <RackDiagram name="Rack A · aisle 3" units={16} hosts={RACK_A_HOSTS} />
      </Demo>

      <Demo
        title="DatacenterRow · multiple racks"
        hint="Horizontal scroll over many racks in a row"
        wide
        intensity="soft"
      >
        <DatacenterRow
          racks={[
            { name: "Rack A", units: 16, hosts: RACK_A_HOSTS },
            { name: "Rack B", units: 12, hosts: RACK_B_HOSTS },
            { name: "Rack C", units: 16, hosts: RACK_A_HOSTS },
          ]}
        />
      </Demo>
    </Group>
  );
}

function MigrationDemo() {
  const [progress, setProgress] = useState(0.38);
  return (
    <Col className="w-full gap-3">
      <LiveMigrationIndicator
        sourceHost={
          <span>
            <span className="text-white">api-gateway-01</span>{" "}
            <span className="text-white/40 text-xs">eu-west-1a</span>
          </span>
        }
        destHost={
          <span>
            <span className="text-white">api-gateway-03</span>{" "}
            <span className="text-white/40 text-xs">eu-west-1c</span>
          </span>
        }
        progress={progress}
        etaMs={(1 - progress) * 2 * 60_000}
        detail="copying memory · 1.2 GB / 4 GB"
      />
      <Row className="gap-2">
        <input
          type="range"
          min={0}
          max={100}
          value={progress * 100}
          onChange={(e) => setProgress(Number(e.target.value) / 100)}
          className="flex-1"
        />
        <span className="text-xs text-white/50 tabular-nums font-mono w-12 text-right">
          {(progress * 100).toFixed(0)}%
        </span>
      </Row>
    </Col>
  );
}
