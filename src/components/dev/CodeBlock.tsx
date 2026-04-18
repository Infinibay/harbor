import { useMemo, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { CopyButton } from "../buttons/CopyButton";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  title?: ReactNode;
  showLineNumbers?: boolean;
  highlight?: number[];
  className?: string;
}

const keywords = new Set([
  "import",
  "export",
  "from",
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "of",
  "in",
  "new",
  "class",
  "extends",
  "await",
  "async",
  "try",
  "catch",
  "throw",
  "null",
  "true",
  "false",
  "undefined",
  "default",
  "type",
  "interface",
]);

function highlightLine(line: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const re =
    /(\/\/.*$)|(["'`])((?:\\.|(?!\2).)*)\2|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_$][\w$]*\b)|([^\w\s])|(\s+)/g;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line)) !== null) {
    const key = `${i++}`;
    if (m[1]) {
      tokens.push(
        <span key={key} className="text-white/35">
          {m[1]}
        </span>,
      );
    } else if (m[2]) {
      tokens.push(
        <span key={key} className="text-emerald-300">
          {m[2] + m[3] + m[2]}
        </span>,
      );
    } else if (m[4]) {
      tokens.push(
        <span key={key} className="text-amber-300">
          {m[4]}
        </span>,
      );
    } else if (m[5]) {
      if (keywords.has(m[5]))
        tokens.push(
          <span key={key} className="text-fuchsia-300">
            {m[5]}
          </span>,
        );
      else if (/^[A-Z]/.test(m[5]))
        tokens.push(
          <span key={key} className="text-sky-300">
            {m[5]}
          </span>,
        );
      else
        tokens.push(
          <span key={key} className="text-white/85">
            {m[5]}
          </span>,
        );
    } else if (m[6]) {
      tokens.push(
        <span key={key} className="text-white/45">
          {m[6]}
        </span>,
      );
    } else if (m[7]) {
      tokens.push(<span key={key}>{m[7]}</span>);
    }
  }
  return tokens;
}

export function CodeBlock({
  code,
  lang,
  title,
  showLineNumbers = true,
  highlight = [],
  className,
}: CodeBlockProps) {
  const lines = useMemo(() => code.split("\n"), [code]);
  const highlightSet = useMemo(() => new Set(highlight), [highlight]);

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur",
        className,
      )}
    >
      {(title || lang) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/8 bg-white/[0.02]">
          <div className="flex items-center gap-2 text-xs text-white/55">
            <span className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
            </span>
            {title ? (
              <span className="text-white/70 font-mono">{title}</span>
            ) : null}
            {lang ? (
              <span className="ml-auto text-[10px] uppercase tracking-wider text-white/40">
                {lang}
              </span>
            ) : null}
          </div>
          <CopyButton value={code} size="sm" />
        </div>
      )}
      <pre className="p-4 pr-10 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>
          {lines.map((ln, i) => (
            <div
              key={i}
              className={cn(
                "grid grid-cols-[auto_1fr] gap-4",
                highlightSet.has(i + 1) &&
                  "bg-fuchsia-500/10 -mx-4 px-4 border-l-2 border-fuchsia-400",
              )}
            >
              {showLineNumbers ? (
                <span className="text-white/25 text-right select-none">
                  {i + 1}
                </span>
              ) : null}
              <span className="whitespace-pre">
                {highlightLine(ln) || " "}
              </span>
            </div>
          ))}
        </code>
      </pre>
      {!title ? (
        <div className="absolute top-2 right-2">
          <CopyButton value={code} size="sm" />
        </div>
      ) : null}
    </div>
  );
}
