import { useMemo, useState } from "react";
import { Group, Demo, Col } from "../../showcase/ShowcaseCard";
import { Button, CodeEditor, Select } from "../../components";
import {
  bashLang,
  cssLang,
  htmlLang,
  jsLang,
  jsonLang,
  markdownLang,
  yamlLang,
  cLang,
  cppLang,
  javaLang,
  rustLang,
  csharpLang,
  kotlinLang,
  goLang,
  type Diagnostic,
  type Language,
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

interface LangEntry {
  value: string;
  label: string;
  language: () => Language<unknown>;
  sample: string;
}

const PROGRAMMING_LANGS: LangEntry[] = [
  {
    value: "ts",
    label: "TypeScript",
    language: () => jsLang({ ts: true, jsx: true }) as Language<unknown>,
    sample: `import { useState, useEffect } from "react";

interface User { id: number; name: string; email?: string }

async function fetchUser(id: number): Promise<User | null> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) return null;
  return await res.json();
}

export function UserCard({ id }: { id: number }) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetchUser(id).then(setUser); }, [id]);
  return user ? <div className="card">{user.name}</div> : null;
}
`,
  },
  {
    value: "c",
    label: "C",
    language: () => cLang() as Language<unknown>,
    sample: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LEN 256

/* Iterative fibonacci. */
long fib(int n) {
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        long t = a + b;
        a = b;
        b = t;
    }
    return a;
}

int main(int argc, char **argv) {
    int n = argc > 1 ? atoi(argv[1]) : 10;
    printf("fib(%d) = %ld\\n", n, fib(n));
    return EXIT_SUCCESS;
}
`,
  },
  {
    value: "cpp",
    label: "C++",
    language: () => cppLang() as Language<unknown>,
    sample: `#include <iostream>
#include <vector>
#include <memory>
#include <string>

template <typename T>
class Stack {
public:
    [[nodiscard]] bool empty() const noexcept { return data_.empty(); }
    void push(T value) { data_.push_back(std::move(value)); }
    T pop() {
        T v = std::move(data_.back());
        data_.pop_back();
        return v;
    }
private:
    std::vector<T> data_;
};

int main() {
    auto raw = R"json({"hello": "world"})json";
    Stack<std::string> s;
    s.push(raw);
    std::cout << s.pop() << '\\n';
    return 0;
}
`,
  },
  {
    value: "java",
    label: "Java",
    language: () => javaLang() as Language<unknown>,
    sample: `package com.example.api;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    /**
     * Look up a user by id.
     */
    public Optional<User> findById(long id) {
        return repo.findOne(id);
    }

    public String greeting(String name) {
        return """
            Hello, %s!
            Welcome to the platform.
            """.formatted(name);
    }
}
`,
  },
  {
    value: "rust",
    label: "Rust",
    language: () => rustLang() as Language<unknown>,
    sample: `use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct User<'a> {
    pub id: u64,
    pub name: &'a str,
}

/// Index users by id for O(1) lookup.
pub fn build_index<'a>(users: Vec<User<'a>>) -> HashMap<u64, User<'a>> {
    users.into_iter().map(|u| (u.id, u)).collect()
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let users = vec![
        User { id: 1, name: "Alice" },
        User { id: 2, name: "Bob" },
    ];
    let json = r#"{"raw": "string with \"quotes\""}"#;
    println!("{:?} {}", build_index(users), json);
    Ok(())
}
`,
  },
  {
    value: "csharp",
    label: "C#",
    language: () => csharpLang() as Language<unknown>,
    sample: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Api.Services;

public record User(long Id, string Name, bool IsActive);

[ApiController]
public class UserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo) => _repo = repo;

    public async Task<User?> FindAsync(long id)
    {
        var path = @"C:\\data\\users.db";
        var msg = $"Looking up user {id} in {path}";
        Console.WriteLine(msg);
        return await _repo.FindOneAsync(id);
    }
}
`,
  },
  {
    value: "kotlin",
    label: "Kotlin",
    language: () => kotlinLang() as Language<unknown>,
    sample: `package com.example.api

import kotlinx.coroutines.flow.Flow

data class User(val id: Long, val name: String, val active: Boolean = true)

class UserService(private val repo: UserRepository) {
    suspend fun findById(id: Long): User? = repo.findOne(id)

    fun activeUsers(): Flow<User> = repo.stream().filter { it.active }

    fun greeting(user: User): String = """
        Hello, \${user.name}!
        Your id is \${user.id}.
    """.trimIndent()

    companion object {
        const val MAX_PAGE_SIZE = 100
    }
}
`,
  },
  {
    value: "go",
    label: "Go",
    language: () => goLang() as Language<unknown>,
    sample: `package main

import (
    "context"
    "fmt"
    "log"
)

type User struct {
    ID   int64
    Name string
}

// FindUser looks up a user by id.
func FindUser(ctx context.Context, id int64) (*User, error) {
    var u User
    query := \`SELECT id, name FROM users WHERE id = $1\`
    if err := db.QueryRowContext(ctx, query, id).Scan(&u.ID, &u.Name); err != nil {
        return nil, err
    }
    return &u, nil
}

func main() {
    u, err := FindUser(context.Background(), 42)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("user: %+v\\n", u)
}
`,
  },
];

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

      <Group id="langs" title="Languages" desc="Fourteen languages ship built-in. Drop in a custom one via the Language plugin API.">
        <Demo title="Multi-language switcher" hint="Switch between programming languages to test highlighting." wide intensity="soft">
          <LanguageSwitcher />
        </Demo>

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

function LanguageSwitcher() {
  const [lang, setLang] = useState("ts");
  const entry = useMemo(
    () => PROGRAMMING_LANGS.find((l) => l.value === lang) ?? PROGRAMMING_LANGS[0],
    [lang],
  );
  const language = useMemo(() => entry.language(), [entry]);
  const [value, setValue] = useState(entry.sample);

  // Reset content when language changes so the user always sees a sample
  // matching the active highlighter.
  const handleLangChange = (v: string) => {
    setLang(v);
    const next = PROGRAMMING_LANGS.find((l) => l.value === v);
    if (next) setValue(next.sample);
  };

  return (
    <Col>
      <div className="max-w-xs">
        <Select
          label="Language"
          value={lang}
          onChange={handleLangChange}
          options={PROGRAMMING_LANGS.map((l) => ({ value: l.value, label: l.label }))}
        />
      </div>
      <CodeEditor
        ariaLabel={`${entry.label} sample`}
        value={value}
        onChange={setValue}
        language={language}
        minHeight={320}
      />
    </Col>
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
