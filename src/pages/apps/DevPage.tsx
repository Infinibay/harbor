import { useEffect, useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { CodeBlock } from "../../components";
import { Terminal } from "../../components";
import { HotkeyRecorder } from "../../components";
import { MarkdownRenderer } from "../../components";
import { DiffViewer } from "../../components";
import { LogViewer, type LogEntry, type LogLevel } from "../../components";
import {
  BranchTree,
  ChangelogFeed,
  CommitCard,
  DeploymentPipeline,
  PullRequestCard,
  type BranchCommit,
  type BranchDef,
  type ChangelogEntry,
  type PipelineStage,
  type PRCheck,
  type PRReviewer,
} from "../../components";
import { Button } from "../../components";
import {
  CopyCommand,
  CronBuilder,
  KeyValueEditor,
  SecretsInput,
  YAMLConfigEditor,
  type KeyValuePair,
} from "../../components";

const markdownSource = `# Quickstart

Infinibay lets you deploy services in **seconds**, with *zero-config* defaults.

## Install

\`\`\`bash
npm install -g infinibay
infinibay login
\`\`\`

## Deploy your first service

1. Connect a repo
2. Pick a region
3. Click deploy

> Tip: use \`infinibay status\` to check health from the CLI.

See [the docs](https://example.com) for more.

---

Made with love.`;

const levels: LogLevel[] = ["debug", "info", "warn", "error"];
const sources = ["api", "auth", "worker", "db", "cache"];

export function DevPage() {
  const [hotkey, setHotkey] = useState<string[]>(["Meta", "Shift", "k"]);
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      time: new Date(Date.now() - (30 - i) * 5000),
      level: levels[Math.floor(Math.random() * 4)],
      source: sources[Math.floor(Math.random() * sources.length)],
      message: sample(),
    })),
  );

  useEffect(() => {
    const t = setInterval(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          time: new Date(),
          level: levels[Math.floor(Math.random() * 4)],
          source: sources[Math.floor(Math.random() * sources.length)],
          message: sample(),
        },
      ].slice(-120));
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <Group id="dev" title="Dev · terminals & code" desc="CodeBlock, Terminal, hotkey recorder.">
      <Demo title="CodeBlock" wide intensity="soft">
        <CodeBlock
          lang="tsx"
          title="src/App.tsx"
          highlight={[3]}
          code={`import { Button } from "./ui";

export function App() {
  return <Button magnetic>Deploy</Button>;
}`}
        />
      </Demo>
      <Demo title="Terminal live" wide intensity="soft">
        <Terminal
          title="deploy.log"
          lines={[
            { id: 1, kind: "cmd", text: "infinibay deploy api" },
            { id: 2, kind: "info", text: "resolving manifests…" },
            { id: 3, kind: "out", text: "  ✓ 12 manifests ok" },
            { id: 4, kind: "info", text: "pushing 8 layers…" },
            { id: 5, kind: "out", text: "  ✓ layers uploaded" },
            { id: 6, kind: "info", text: "rolling out 3 replicas…" },
            { id: 7, kind: "out", text: "  ✓ replicas healthy" },
            { id: 8, kind: "out", text: "  ✔ live at https://api.infini.bay" },
          ]}
        />
      </Demo>
      <Demo title="Hotkey recorder" intensity="soft">
        <Col>
          <HotkeyRecorder label="Trigger command palette" value={hotkey} onChange={setHotkey} />
          <span className="text-xs text-white/50 font-mono">
            {hotkey.join(" + ") || "—"}
          </span>
        </Col>
      </Demo>

      <Demo title="MarkdownRenderer" hint="Read-only. Headings, lists, code, quotes, links." wide intensity="soft">
        <div className="w-full rounded-xl bg-white/[0.02] border border-white/8 p-4">
          <MarkdownRenderer source={markdownSource} />
        </div>
      </Demo>

      <Demo title="DiffViewer — code review" wide intensity="soft">
        <DiffViewer
          mode="split"
          oldLabel="before"
          newLabel="after"
          oldText={`function greet(name) {
  console.log("hi " + name);
}

greet("world");`}
          newText={`function greet(name, greeting = "hi") {
  const msg = \`\${greeting}, \${name}\`;
  console.log(msg);
  return msg;
}

greet("world", "hello");`}
        />
      </Demo>

      <Demo title="LogViewer live" hint="Filtros por nivel, search, pausa." wide intensity="soft">
        <LogViewer entries={logs} height={320} />
      </Demo>

      <DevOpsPackDemo />
      <ConfigFormsPackDemo />
    </Group>
  );
}

// === Pack 9: config + forms demos ===============================

function ConfigFormsPackDemo() {
  const [envVars, setEnvVars] = useState<KeyValuePair[]>([
    { id: "1", key: "DATABASE_URL", value: "postgres://localhost/app" },
    { id: "2", key: "API_KEY", value: "sk_live_abcd1234efgh5678ijkl9012" },
    { id: "3", key: "NODE_ENV", value: "production" },
    { id: "4", key: "JWT_SECRET", value: "super-secret-do-not-share-xoxo" },
  ]);
  const [secret, setSecret] = useState("sk_live_abcd1234efgh5678ijkl9012mnop3456");
  const [cron, setCron] = useState("0 3 * * *");
  const [yaml, setYaml] = useState(`# Infinibay service config
apiVersion: infinibay/v1
kind: Service
metadata:
  name: api-gateway
  region: eu-west-1
spec:
  replicas: 4
  resources:
    cpu: 2
    memory: 4Gi
  env:
    - name: NODE_ENV
      value: production
`);

  return (
    <>
      <Demo title="KeyValueEditor · env vars with secret auto-detect" wide intensity="soft">
        <KeyValueEditor
          value={envVars}
          onChange={setEnvVars}
          header={
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-white/40">
                Environment
              </span>
              <span className="text-xs text-white/40">
                drag ⋮⋮ to reorder · keys matching `secret|token|key|password` get masked
              </span>
            </div>
          }
        />
      </Demo>

      <Demo title="SecretsInput · reveal with auto-remask" wide intensity="soft">
        <Col className="gap-3">
          <SecretsInput
            label="API key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            autoReveal={8}
            caption="Rotates every 90 days."
          />
          <SecretsInput
            label="SSH private key"
            value="-----BEGIN OPENSSH PRIVATE KEY-----..."
            readOnly
            caption="Read-only example"
          />
        </Col>
      </Demo>

      <Demo
        title="YAMLConfigEditor · line numbers + schema-aware lint"
        hint="Required keys: apiVersion, kind · disallowed: deprecated_flag"
        wide
        intensity="soft"
      >
        <YAMLConfigEditor
          value={yaml}
          onChange={setYaml}
          height={260}
          schema={{ requiredKeys: ["apiVersion", "kind"], disallowedKeys: ["deprecated_flag"] }}
        />
      </Demo>

      <Demo title="CopyCommand · install snippet with tabs" wide intensity="soft">
        <CopyCommand
          variants={[
            { label: "macOS", code: "brew install infinibay\ninfinibay login" },
            { label: "Linux", code: "curl -sSL https://get.infinibay.com | bash\ninfinibay login" },
            { label: "Windows PS", code: "iwr -useb https://get.infinibay.com/ps1 | iex\ninfinibay login" },
            { label: "Docker", code: "docker run --rm -it infinibay/cli login" },
          ]}
        />
      </Demo>

      <Demo title="CronBuilder · 5-field POSIX + next runs" wide intensity="soft">
        <CronBuilder value={cron} onChange={setCron} />
      </Demo>
    </>
  );
}

// === Pack 5: DevOps + deploy demos ==============================

const PIPELINE_STAGES: PipelineStage[] = [
  { id: "checkout", name: "Checkout", status: "success", duration: 4200 },
  { id: "build", name: "Build", status: "success", duration: 58_000 },
  { id: "test", name: "Test", status: "success", duration: 38_000 },
  { id: "scan", name: "Security scan", status: "running", startedAt: Date.now() - 22_000, detail: "2/7 OWASP checks" },
  { id: "staging", name: "Deploy staging", status: "pending" },
  { id: "smoke", name: "Smoke tests", status: "pending" },
  { id: "prod", name: "Deploy prod", status: "pending" },
];

const REVIEWERS: PRReviewer[] = [
  { id: "u1", name: "Ada L.", state: "approved" },
  { id: "u2", name: "Ken M.", state: "changes-requested" },
  { id: "u3", name: "Rie T.", state: "commented" },
  { id: "u4", name: "Bruno F.", state: "pending" },
];

const CHECKS: PRCheck[] = [
  { id: "c1", name: "build", state: "passing" },
  { id: "c2", name: "tests", state: "passing" },
  { id: "c3", name: "lint", state: "passing" },
  { id: "c4", name: "e2e", state: "failing" },
  { id: "c5", name: "deploy-preview", state: "pending" },
];

const BRANCHES: BranchDef[] = [
  { name: "main", color: "#a855f7" },
  { name: "feat/auth-v2", color: "#38bdf8" },
  { name: "fix/logs", color: "#f472b6" },
];

const COMMITS: BranchCommit[] = [
  { sha: "a1b2c3d4", parents: ["e5f6g7h8"], branch: "feat/auth-v2", message: "auth: replace JWT signer", at: Date.now() - 1 * 3600_000, author: "Ada", refs: ["HEAD", "feat/auth-v2"] },
  { sha: "e5f6g7h8", parents: ["i9j0k1l2", "m3n4o5p6"], branch: "feat/auth-v2", message: "Merge main into feat/auth-v2", at: Date.now() - 3 * 3600_000, author: "Ada", merge: true },
  { sha: "m3n4o5p6", parents: ["q7r8s9t0"], branch: "main", message: "chore: bump deps", at: Date.now() - 4 * 3600_000, author: "Rie", refs: ["main"] },
  { sha: "i9j0k1l2", parents: ["m3n4o5p6"], branch: "feat/auth-v2", message: "auth: add OIDC discovery", at: Date.now() - 6 * 3600_000, author: "Ada" },
  { sha: "q7r8s9t0", parents: ["aa11bb22", "cc33dd44"], branch: "main", message: "Merge fix/logs", at: Date.now() - 10 * 3600_000, author: "Ken", merge: true },
  { sha: "cc33dd44", parents: ["aa11bb22"], branch: "fix/logs", message: "logs: fix stream pause", at: Date.now() - 12 * 3600_000, author: "Ken" },
  { sha: "aa11bb22", parents: [], branch: "main", message: "Initial", at: Date.now() - 20 * 3600_000, author: "—" },
];

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v2.3.0",
    date: Date.now() - 2 * 86400_000,
    title: "Canvas packs — production-grade editor primitives",
    sections: [
      {
        label: "New",
        items: [
          { kind: "feature", text: "`CanvasSelectionBox` with 8 resize handles + animated transitions" },
          { kind: "feature", text: "`CanvasSnapGuides` — pink-line smart guides on drag" },
          { kind: "feature", text: "`useCanvasHistory` — generic undo/redo with transient preview slot" },
        ],
      },
      {
        label: "Improvements",
        items: [
          { kind: "improvement", text: "Snap priority: edges over grid for cleaner alignment" },
          { kind: "improvement", text: "Marquee renders via Portal to avoid world-transform distortion" },
        ],
      },
    ],
  },
  {
    version: "v2.2.0",
    date: Date.now() - 8 * 86400_000,
    title: "Observability pack",
    sections: [
      {
        label: "New",
        items: [
          { kind: "feature", text: "`TimeSeriesChart` with brush-to-zoom" },
          { kind: "feature", text: "`LogTailer` — streaming logs with follow mode" },
          { kind: "feature", text: "`FlameGraph`, `TraceWaterfall`, `MetricHeatmap`" },
        ],
      },
      {
        label: "Fixes",
        items: [
          { kind: "fix", text: "strict-mode null-check in Canvas drag handler" },
        ],
      },
      {
        label: "Security",
        items: [
          { kind: "security", text: "Sanitize stored selection state from localStorage round-trip" },
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: Date.now() - 40 * 86400_000,
    title: "Harbor 2.0",
    sections: [
      {
        label: "Highlights",
        items: [
          { kind: "breaking", text: "`HostStatus` is now a subset of the shared `Status` type" },
          { kind: "feature", text: "Pack 1 foundation (format.ts + 7 status widgets)" },
        ],
      },
    ],
  },
];

function DevOpsPackDemo() {
  return (
    <>
      <Demo title="DeploymentPipeline" hint="Running-stage connector pulses" wide intensity="soft">
        <DeploymentPipeline
          stages={PIPELINE_STAGES}
          onStageClick={(s) => console.info("stage", s.id)}
        />
      </Demo>

      <Demo title="CommitCard" wide intensity="soft">
        <Col className="gap-2 w-full">
          <CommitCard
            sha="a1b2c3d4e5f6"
            authorName="Ada Lovelace"
            message={"auth: replace JWT signer with libsodium\n\nMoves away from jose because of the recent CVE. Backwards-compatible\nwith existing tokens; issues new ones on the next refresh."}
            at={Date.now() - 1 * 3600_000}
            stats={{ additions: 142, deletions: 86, files: 9 }}
            refs={["HEAD", "feat/auth-v2"]}
          />
          <CommitCard
            sha="m3n4o5p6q7r8"
            authorName="Rie Takahashi"
            message="chore: bump deps"
            at={Date.now() - 4 * 3600_000}
            stats={{ additions: 12, deletions: 8, files: 2 }}
          />
        </Col>
      </Demo>

      <Demo title="PullRequestCard" wide intensity="soft">
        <PullRequestCard
          number={4217}
          title="Add OIDC discovery + dynamic JWKS refresh"
          state="open"
          authorName="Ada Lovelace"
          createdAt={Date.now() - 18 * 3600_000}
          fromBranch="feat/auth-v2"
          toBranch="main"
          reviewers={REVIEWERS}
          checks={CHECKS}
          diff={{ additions: 284, deletions: 91, files: 14 }}
          actions={
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost">
                Approve
              </Button>
              <Button size="sm">Merge</Button>
            </div>
          }
        />
      </Demo>

      <Demo title="BranchTree · mini git graph" wide intensity="soft">
        <div className="bg-[#0d0d14] rounded-xl border border-white/10 p-2">
          <BranchTree commits={COMMITS} branches={BRANCHES} rowHeight={28} />
        </div>
      </Demo>

      <Demo title="ChangelogFeed" hint="Filter by kind · collapsible per version" wide intensity="soft">
        <ChangelogFeed entries={CHANGELOG} />
      </Demo>
    </>
  );
}

function sample() {
  const msgs = [
    "request handled in 42ms",
    "connection pool exhausted — scaling up",
    "cache miss for key workspace:prod:42",
    "token refreshed for user 8921",
    "unexpected 500 from upstream",
    "GC pause 32ms",
    "health check ok",
    "retry attempt 2 for job queue:send-email",
    "deploy manifest validated",
  ];
  return msgs[Math.floor(Math.random() * msgs.length)];
}
