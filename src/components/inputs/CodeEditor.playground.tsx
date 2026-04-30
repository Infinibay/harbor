import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { jsLang, jsonLang } from "../../lib/code";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const SAMPLES: Record<string, string> = {
  javascript: `// Try Tab, Ctrl+/, Ctrl+D, Alt+Up/Down\nfunction greet(name) {\n  if (!name) return "hello, world";\n  return \`hello, \${name}\`;\n}\n\nconst names = ["ada", "alan", "grace"];\nnames.map(greet).forEach((s) => console.log(s));\n`,
  json: `{\n  "name": "harbor",\n  "version": "0.1.0",\n  "scripts": {\n    "build": "vite build",\n    "test": "vitest"\n  },\n  "tags": ["ui", "react", "library"]\n}\n`,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CodeEditorDemo(props: any) {
  const lang: "javascript" | "json" = props.lang ?? "javascript";
  const [value, setValue] = useState(SAMPLES[lang]);
  // Reset sample when switching languages
  const [activeLang, setActiveLang] = useState(lang);
  if (activeLang !== lang) {
    setActiveLang(lang);
    setValue(SAMPLES[lang]);
  }
  return (
    <CodeEditor
      ariaLabel="Code sample"
      language={lang === "json" ? jsonLang() : jsLang({ ts: true })}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange?.(next);
      }}
      height={props.height}
      showLineNumbers={props.showLineNumbers}
      readOnly={props.readOnly}
      placeholder={props.placeholder}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: CodeEditorDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    lang: { type: "select", options: ["javascript", "json"], default: "javascript" },
    height: { type: "number", default: 280, min: 120, max: 600, step: 20 },
    showLineNumbers: { type: "boolean", default: true },
    readOnly: { type: "boolean", default: false },
    placeholder: { type: "text", default: "" },
  },
  variants: [
    { label: "JavaScript", props: { lang: "javascript" } },
    { label: "JSON", props: { lang: "json" } },
    { label: "Read-only", props: { lang: "json", readOnly: true } },
    { label: "No gutter", props: { showLineNumbers: false } },
  ],
  events: [{ name: "onChange", signature: "(next: string) => void" }],
  notes:
    "Try Ctrl+F (find), Ctrl+/ (toggle comment), Ctrl+D (select next match), Alt+Up/Down (move line), Tab/Shift+Tab (indent).",
};
