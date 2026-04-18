import { useMemo, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface MarkdownRendererProps {
  source: string;
  className?: string;
}

/** Tiny, defensive Markdown renderer.
 *
 * Supports: # headings, **bold**, *italic*, `inline code`, ``` code blocks,
 * > quotes, - / 1. lists, [links](url), ---, and paragraphs. No HTML passed
 * through — everything is escaped by React. */
export function MarkdownRenderer({ source, className }: MarkdownRendererProps) {
  const blocks = useMemo(() => parseBlocks(source), [source]);

  return (
    <div className={cn("text-sm text-white/80 leading-relaxed space-y-3", className)}>
      {blocks}
    </div>
  );
}

function parseBlocks(src: string): ReactNode[] {
  const lines = src.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // closing fence
      out.push(
        <pre
          key={key++}
          className="rounded-lg bg-black/40 border border-white/8 p-3 overflow-auto text-[12.5px] font-mono text-white/85"
        >
          {lang ? (
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">{lang}</div>
          ) : null}
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Heading
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const content = renderInline(h[2]);
      const cls =
        level === 1
          ? "text-2xl font-bold text-white"
          : level === 2
            ? "text-xl font-semibold text-white"
            : level === 3
              ? "text-lg font-semibold text-white"
              : "text-base font-semibold text-white/90";
      if (level === 1) out.push(<h1 key={key++} className={cls}>{content}</h1>);
      else if (level === 2) out.push(<h2 key={key++} className={cls}>{content}</h2>);
      else if (level === 3) out.push(<h3 key={key++} className={cls}>{content}</h3>);
      else if (level === 4) out.push(<h4 key={key++} className={cls}>{content}</h4>);
      else if (level === 5) out.push(<h5 key={key++} className={cls}>{content}</h5>);
      else out.push(<h6 key={key++} className={cls}>{content}</h6>);
      i++;
      continue;
    }

    // HR
    if (/^---+\s*$/.test(line)) {
      out.push(<hr key={key++} className="border-white/10" />);
      i++;
      continue;
    }

    // Quote
    if (/^>\s?/.test(line)) {
      const q: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        q.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      out.push(
        <blockquote
          key={key++}
          className="border-l-2 border-fuchsia-400/50 pl-3 text-white/70 italic"
        >
          {renderInline(q.join(" "))}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push(
        <ul key={key++} className="list-disc list-inside space-y-1 text-white/80">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol key={key++} className="list-decimal list-inside space-y-1 text-white/80">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blank line → skip
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph — collect lines until blank
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={key++} className="text-white/80">
        {renderInline(para.join(" "))}
      </p>,
    );
  }

  return out;
}

function renderInline(text: string): ReactNode[] {
  // Order matters: code first to avoid formatting inside code.
  const out: ReactNode[] = [];
  let rest = text;
  let key = 0;

  while (rest.length > 0) {
    // inline code `x`
    const codeM = /^`([^`]+)`/.exec(rest);
    if (codeM) {
      out.push(
        <code
          key={key++}
          className="px-1 py-0.5 rounded bg-white/8 font-mono text-[0.9em] text-fuchsia-200"
        >
          {codeM[1]}
        </code>,
      );
      rest = rest.slice(codeM[0].length);
      continue;
    }
    // bold **x**
    const boldM = /^\*\*([^*]+)\*\*/.exec(rest);
    if (boldM) {
      out.push(
        <strong key={key++} className="text-white font-semibold">
          {renderInline(boldM[1])}
        </strong>,
      );
      rest = rest.slice(boldM[0].length);
      continue;
    }
    // italic *x*
    const italM = /^\*([^*]+)\*/.exec(rest);
    if (italM) {
      out.push(<em key={key++}>{renderInline(italM[1])}</em>);
      rest = rest.slice(italM[0].length);
      continue;
    }
    // link [text](url)
    const linkM = /^\[([^\]]+)\]\(([^)]+)\)/.exec(rest);
    if (linkM) {
      out.push(
        <a
          key={key++}
          href={linkM[2]}
          className="text-fuchsia-300 underline underline-offset-2 hover:text-fuchsia-200"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkM[1]}
        </a>,
      );
      rest = rest.slice(linkM[0].length);
      continue;
    }
    // plain text until next special char
    const plain = /^[^`*\[]+/.exec(rest);
    if (plain) {
      out.push(plain[0]);
      rest = rest.slice(plain[0].length);
    } else {
      out.push(rest[0]);
      rest = rest.slice(1);
    }
  }
  return out;
}
