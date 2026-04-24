import { useMemo, useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { Button, CodeEditor } from "../../components";
import {
  bashLang,
  cssLang,
  htmlLang,
  jsLang,
  jsonLang,
  markdownLang,
  yamlLang,
  type Diagnostic,
} from "../../lib/code";

const TS_SAMPLE = `// CodeEditor showcase
import { useState } from "react";
import type { FC } from "react";

interface Props { initial: number }

export const Counter: FC<Props> = ({ initial }) => {
  const [n, setN] = useState(initial);
  return (
    <button onClick={() => setN(n + 1)}>
      {\`clicked \${n} \${n === 1 ? "time" : "times"}\`}
    </button>
  );
};
`;

const JSON_SAMPLE = `{
  "name": "harbor-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
`;

const MD_SAMPLE = `# Release notes

Harbor **4.2** ships a full *code editor* with:

- Multi-language highlighting
- Virtualized lines for large files
- Find / replace + diagnostics

See \`@infinibay/harbor\` for the API.

\`\`\`ts
import { CodeEditor } from "@infinibay/harbor";
\`\`\`
`;

const HTML_SAMPLE = `<!doctype html>
<html>
  <head>
    <title>Hello</title>
    <style>
      body { color: steelblue; }
    </style>
  </head>
  <body>
    <h1>Welcome</h1>
    <script>
      const greet = () => console.log("hi");
      greet();
    </script>
  </body>
</html>
`;

const CSS_SAMPLE = `.card {
  /* drop-in card */
  background: #1a1f2e;
  padding: 1rem;
  border-radius: 12px;
}

.card:hover { transform: translateY(-2px); }

@media (min-width: 768px) {
  .card { padding: 1.5rem; }
}
`;

const BASH_SAMPLE = `#!/usr/bin/env bash
set -euo pipefail

for dir in src lib test; do
  if [ -d "$dir" ]; then
    echo "scanning $dir"
    find "$dir" -name "*.ts" | wc -l
  fi
done
`;

const YAML_SAMPLE = `name: deploy
on:
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
`;

function generateLargeFile(count: number): string {
  const lines: string[] = [];
  for (let i = 0; i < count; i++) {
    lines.push(`export const v${i} = ${i}; // entry ${i}`);
  }
  return lines.join("\n");
}

export function CodeEditorPage() {
  const [tsValue, setTsValue] = useState(TS_SAMPLE);
  const [tsReadonly, setTsReadonly] = useState(false);
  const [jsonValue, setJsonValue] = useState(JSON_SAMPLE);
  const [mdValue, setMdValue] = useState(MD_SAMPLE);
  const [bigValue, setBigValue] = useState<string | null>(null);

  const jsonDiagnostics = useMemo((): Diagnostic[] => {
    try {
      JSON.parse(jsonValue);
      return [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const m = msg.match(/position (\d+)/);
      if (m) {
        const pos = parseInt(m[1], 10);
        let line = 1;
        let col = 1;
        for (let i = 0; i < pos && i < jsonValue.length; i++) {
          if (jsonValue.charAt(i) === "\n") {
            line++;
            col = 1;
          } else col++;
        }
        return [{ line, column: col, severity: "error", message: msg }];
      }
      return [{ line: 1, severity: "error", message: msg }];
    }
  }, [jsonValue]);

  return (
    <div>
      <Group
        id="basic"
        title="Code editor"
        desc="Zero-dep multi-language editable surface: tokenizer, highlight, line numbers, bracket matching, find/replace, diagnostics, 10k-line virtualization."
      >
        <Demo title="TypeScript + readonly toggle" wide intensity="soft">
          <Col>
            <div className="flex justify-end mb-2">
              <Button size="sm" onClick={() => setTsReadonly((r) => !r)}>
                {tsReadonly ? "Unlock" : "Read-only"}
              </Button>
            </div>
            <CodeEditor
              ariaLabel="TypeScript sample"
              value={tsValue}
              onChange={setTsValue}
              language={jsLang({ ts: true, jsx: true })}
              readOnly={tsReadonly}
              minHeight={280}
            />
          </Col>
        </Demo>

        <Demo
          title="JSON with live validation"
          hint="Diagnostics via consumer-provided prop."
          intensity="soft"
        >
          <CodeEditor
            ariaLabel="JSON editor"
            value={jsonValue}
            onChange={setJsonValue}
            language={jsonLang({ json5: true })}
            diagnostics={jsonDiagnostics}
            minHeight={240}
          />
        </Demo>
      </Group>

      <Group id="langs" title="Languages" desc="Seven languages ship built-in. Drop in a custom one via the Language plugin API.">
        <Demo title="Markdown with live preview" wide intensity="soft">
          <Col>
            <div className="grid md:grid-cols-2 gap-3">
              <CodeEditor
                ariaLabel="Markdown source"
                value={mdValue}
                onChange={setMdValue}
                language={markdownLang()}
                minHeight={280}
              />
              <div className="p-4 rounded-xl border border-white/10 bg-[rgb(var(--harbor-bg-elev-1))] prose prose-invert max-w-none text-sm">
                <MarkdownPreview source={mdValue} />
              </div>
            </div>
          </Col>
        </Demo>

        <Demo title="HTML + embedded script / style" intensity="soft">
          <CodeEditor
            ariaLabel="HTML sample"
            defaultValue={HTML_SAMPLE}
            language={htmlLang()}
            minHeight={260}
          />
        </Demo>

        <Demo title="CSS" intensity="soft">
          <CodeEditor
            ariaLabel="CSS sample"
            defaultValue={CSS_SAMPLE}
            language={cssLang()}
            minHeight={220}
          />
        </Demo>

        <Demo title="Bash (read-only console)" intensity="soft">
          <CodeEditor
            ariaLabel="Bash sample"
            defaultValue={BASH_SAMPLE}
            language={bashLang()}
            readOnly
            minHeight={200}
          />
        </Demo>

        <Demo title="YAML" intensity="soft">
          <CodeEditor
            ariaLabel="YAML sample"
            defaultValue={YAML_SAMPLE}
            language={yamlLang()}
            minHeight={220}
          />
        </Demo>
      </Group>

      <Group
        id="perf"
        title="Performance"
        desc="Spacer virtualization + incremental tokenizer cache keep large files fluid."
      >
        <Demo title="10 000 line file" wide intensity="soft">
          <Col>
            <div className="flex justify-end mb-2">
              <Button
                size="sm"
                onClick={() =>
                  setBigValue(bigValue ? null : generateLargeFile(10_000))
                }
              >
                {bigValue ? "Clear" : "Generate 10k lines"}
              </Button>
            </div>
            <CodeEditor
              ariaLabel="Large file"
              value={bigValue ?? "// Press the button to generate a 10 000-line file"}
              onChange={setBigValue}
              language={jsLang({ ts: true })}
              height={360}
            />
          </Col>
        </Demo>

        <Demo title="Find / Replace" hint="Ctrl+F / Ctrl+H · Enter cycles matches · Escape closes." intensity="soft">
          <CodeEditor
            ariaLabel="Find demo"
            defaultValue={
              "apple banana apple cherry\n" +
              "apple date apple fig\n" +
              "grape apple honey apple"
            }
            language={jsLang()}
            minHeight={200}
          />
        </Demo>
      </Group>

      <Group id="ref" title="Shortcuts reference" desc="Every keybinding the editor currently intercepts.">
        <Demo title="Keyboard commands" wide intensity="quiet">
          <Col>
            <ShortcutTable />
          </Col>
        </Demo>
      </Group>
    </div>
  );
}

function MarkdownPreview({ source }: { source: string }) {
  // Extremely light MD → HTML transform, enough for showcase flavor.
  const html = useMemo(() => {
    const esc = (s: string) =>
      s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const lines = source.split("\n");
    const out: string[] = [];
    let inCode = false;
    for (const raw of lines) {
      if (raw.startsWith("```")) {
        out.push(inCode ? "</code></pre>" : "<pre><code>");
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        out.push(esc(raw));
        continue;
      }
      let ln = esc(raw);
      const headingMatch = ln.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const lvl = headingMatch[1].length;
        ln = `<h${lvl}>${headingMatch[2]}</h${lvl}>`;
      } else if (ln.startsWith("- ")) {
        ln = `<li>${ln.slice(2)}</li>`;
      } else if (ln.trim() === "") {
        ln = "<br/>";
      } else {
        ln = `<p>${ln}</p>`;
      }
      ln = ln
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
      out.push(ln);
    }
    return out.join("\n");
  }, [source]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function ShortcutTable() {
  const rows: Array<[string, string]> = [
    ["Tab / Shift+Tab", "Indent / dedent (respects multi-line selection)"],
    ["Enter", "Auto-indent from previous line + extra level after `{[(:,`"],
    ["Ctrl/⌘+/", "Toggle line comment"],
    ["Ctrl/⌘+D", "Select word, then next occurrence"],
    ["Ctrl/⌘+L", "Select current line"],
    ["Alt+↑ / ↓", "Move current line up / down"],
    ["Shift+Alt+↑ / ↓", "Duplicate current line up / down"],
    ["Ctrl/⌘+Shift+K", "Delete current line"],
    ["Ctrl/⌘+] / [", "Indent / dedent selection"],
    ["Ctrl/⌘+F", "Open Find"],
    ["Ctrl/⌘+H", "Open Find & Replace"],
    ["Enter / Shift+Enter inside Find", "Next / previous match"],
    ["Escape", "Close Find"],
    ["(type paired)", "Auto-close `()`, `[]`, `{}`, `\"\"`, `''`, \\`\\`"],
  ];
  return (
    <table className="w-full text-xs font-mono border border-white/10 rounded overflow-hidden">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-t border-white/5 first:border-t-0">
            <th className="text-left px-3 py-1.5 bg-white/5 text-[rgb(var(--harbor-text-muted))] w-60 align-top">
              {k}
            </th>
            <td className="px-3 py-1.5 text-[rgb(var(--harbor-text))]">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
