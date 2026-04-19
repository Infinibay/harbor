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
import {
  BootSequence,
  DiskAllocator,
  ImageGallery,
  SnapshotTimeline,
  VMConsole,
  type BootStage,
  type DiskAllocation,
  type OSImage,
  type Snapshot,
} from "../../components";

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

      <VMLifecycleDemos />
    </Group>
  );
}

// === Pack 4: VM lifecycle demos =================================

const BOOT_STAGES: BootStage[] = [
  { id: "bios", label: "BIOS POST", status: "done", duration: 1200 },
  { id: "bootloader", label: "GRUB bootloader", status: "done", duration: 340 },
  { id: "kernel", label: "Linux kernel 6.8.0", status: "done", duration: 2100, detail: "/boot/vmlinuz-6.8.0-infinibay1" },
  { id: "initramfs", label: "initramfs", status: "done", duration: 680 },
  { id: "systemd", label: "systemd PID 1", status: "running", detail: "starting 27 units…" },
  { id: "network", label: "network.target", status: "pending" },
  { id: "services", label: "multi-user.target", status: "pending" },
  { id: "ready", label: "Login ready", status: "pending" },
];

const IMAGES: OSImage[] = [
  { id: "ub-24", name: "Ubuntu Server", os: "ubuntu", version: "24.04 LTS", size: 620_000_000, lastUsed: Date.now() - 2 * 3600_000, usageCount: 142, icon: "🟠", description: "Long-term support · 2034" },
  { id: "de-12", name: "Debian", os: "debian", version: "12 bookworm", size: 540_000_000, lastUsed: Date.now() - 24 * 3600_000, usageCount: 88, icon: "🔴" },
  { id: "al-3.19", name: "Alpine", os: "alpine", version: "3.19", size: 3_200_000, lastUsed: Date.now() - 3 * 86400_000, usageCount: 410, icon: "🏔️", description: "Minimal · musl + busybox" },
  { id: "nx-24", name: "NixOS", os: "nixos", version: "24.05", size: 980_000_000, lastUsed: Date.now() - 6 * 3600_000, usageCount: 31, icon: "❄️" },
  { id: "fedora", name: "Fedora", os: "fedora", version: "40", size: 1_800_000_000, lastUsed: Date.now() - 7 * 86400_000, usageCount: 12, icon: "🎩" },
  { id: "centos", name: "CentOS Stream", os: "centos", version: "9", size: 1_500_000_000, lastUsed: Date.now() - 30 * 86400_000, usageCount: 4, icon: "🟣" },
];

const SNAPSHOTS: Snapshot[] = [
  { id: "s1", at: Date.now() - 30 * 86400_000, size: 12_400_000_000, label: "before v2 migration", kind: "pre-migration", locked: true },
  { id: "s2", at: Date.now() - 21 * 86400_000, size: 12_800_000_000, kind: "auto" },
  { id: "s3", at: Date.now() - 14 * 86400_000, size: 13_100_000_000, kind: "auto" },
  { id: "s4", at: Date.now() - 7 * 86400_000, size: 13_400_000_000, kind: "auto" },
  { id: "s5", at: Date.now() - 2 * 86400_000, size: 13_600_000_000, label: "manual · pre-deploy", kind: "manual" },
  { id: "s6", at: Date.now() - 6 * 3600_000, size: 13_650_000_000, kind: "auto" },
];

function VMLifecycleDemos() {
  const [allocations, setAllocations] = useState<DiskAllocation[]>([
    { id: "a1", label: "system", size: 40 * 1024 ** 3, tone: "used" },
    { id: "a2", label: "data", size: 120 * 1024 ** 3, tone: "used" },
    { id: "a3", label: "backup", size: 80 * 1024 ** 3, tone: "backup" },
  ]);

  return (
    <>
      <Demo title="VMConsole · adapter contract" hint="Renders chrome; bring your own xterm.js" wide intensity="soft">
        <VMConsole
          name="api-gateway-01"
          subtitle="eu-west-1a · Ubuntu 24.04 · 8 vCPU"
          status="online"
          resolution="120 × 30"
          height={280}
        />
      </Demo>

      <Demo title="BootSequence · animated progress" wide intensity="soft">
        <BootSequence stages={BOOT_STAGES} />
      </Demo>

      <Demo title="SnapshotTimeline" hint="Hover a point for restore / delete" wide intensity="soft">
        <SnapshotTimeline
          snapshots={SNAPSHOTS}
          onRestore={(s) => console.info("restore", s.id)}
          onDelete={(s) => console.info("delete", s.id)}
        />
      </Demo>

      <Demo title="ImageGallery · OS templates" hint="Search + sort · click to select" wide intensity="soft">
        <ImageGallery images={IMAGES} selectedId="ub-24" />
      </Demo>

      <Demo
        title="DiskAllocator · drag on free space to reserve"
        hint="Click × on a slab to release · min 1 GB"
        wide
        intensity="soft"
      >
        <DiskAllocator
          total={500 * 1024 ** 3}
          allocations={allocations}
          onChange={setAllocations}
          header={
            <span className="text-[10px] uppercase tracking-widest text-white/50">
              Storage · nvme0
            </span>
          }
        />
      </Demo>
    </>
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
