import { useEffect, useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { CodeBlock } from "../../components";
import { Terminal } from "../../components";
import { HotkeyRecorder } from "../../components";
import { MarkdownRenderer } from "../../components";
import { DiffViewer } from "../../components";
import { LogViewer, type LogEntry, type LogLevel } from "../../components";

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
      <Demo title="CodeBlock" wide>
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
      <Demo title="Terminal live" wide>
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
      <Demo title="Hotkey recorder">
        <Col>
          <HotkeyRecorder label="Trigger command palette" value={hotkey} onChange={setHotkey} />
          <span className="text-xs text-white/50 font-mono">
            {hotkey.join(" + ") || "—"}
          </span>
        </Col>
      </Demo>

      <Demo title="MarkdownRenderer" hint="Read-only. Headings, lists, code, quotes, links." wide>
        <div className="w-full rounded-xl bg-white/[0.02] border border-white/8 p-4">
          <MarkdownRenderer source={markdownSource} />
        </div>
      </Demo>

      <Demo title="DiffViewer — code review" wide>
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

      <Demo title="LogViewer live" hint="Filtros por nivel, search, pausa." wide>
        <LogViewer entries={logs} height={320} />
      </Demo>
    </Group>
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
