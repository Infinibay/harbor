import { useMemo } from "react";
import { cn } from "../../lib/cn";

export interface DiffViewerProps {
  oldText: string;
  newText: string;
  mode?: "unified" | "split";
  oldLabel?: string;
  newLabel?: string;
  className?: string;
}

type Line = {
  kind: "same" | "add" | "del";
  oldNum?: number;
  newNum?: number;
  text: string;
};

/** Minimal LCS-based line diff — fine for small/medium inputs. */
function computeDiff(oldText: string, newText: string): Line[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const m = a.length;
  const n = b.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const out: Line[] = [];
  let i = 0, j = 0, oldN = 1, newN = 1;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      out.push({ kind: "same", oldNum: oldN++, newNum: newN++, text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      out.push({ kind: "del", oldNum: oldN++, text: a[i] });
      i++;
    } else {
      out.push({ kind: "add", newNum: newN++, text: b[j] });
      j++;
    }
  }
  while (i < m) out.push({ kind: "del", oldNum: oldN++, text: a[i++] });
  while (j < n) out.push({ kind: "add", newNum: newN++, text: b[j++] });
  return out;
}

export function DiffViewer({
  oldText,
  newText,
  mode = "unified",
  oldLabel = "old",
  newLabel = "new",
  className,
}: DiffViewerProps) {
  const lines = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

  const stats = lines.reduce(
    (acc, l) => {
      if (l.kind === "add") acc.add++;
      else if (l.kind === "del") acc.del++;
      return acc;
    },
    { add: 0, del: 0 },
  );

  const header = (
    <div className="px-3 py-2 border-b border-white/8 flex items-center justify-between bg-white/[0.03]">
      <div className="text-xs text-white/70 font-mono">
        <span className="text-rose-300">{oldLabel}</span>
        <span className="text-white/30 mx-2">→</span>
        <span className="text-emerald-300">{newLabel}</span>
      </div>
      <div className="text-xs font-mono flex gap-2">
        <span className="text-emerald-300">+{stats.add}</span>
        <span className="text-rose-300">−{stats.del}</span>
      </div>
    </div>
  );

  if (mode === "split") {
    return (
      <div className={cn("rounded-lg bg-[#0d0d14] border border-white/8 overflow-hidden font-mono text-[12.5px]", className)}>
        {header}
        <div className="grid grid-cols-2 divide-x divide-white/8">
          <div>
            {lines
              .filter((l) => l.kind !== "add")
              .map((l, i) => (
                <Row key={`o${i}`} line={l} side="old" />
              ))}
          </div>
          <div>
            {lines
              .filter((l) => l.kind !== "del")
              .map((l, i) => (
                <Row key={`n${i}`} line={l} side="new" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg bg-[#0d0d14] border border-white/8 overflow-hidden font-mono text-[12.5px]", className)}>
      {header}
      <div>
        {lines.map((l, i) => (
          <Row key={i} line={l} side="unified" />
        ))}
      </div>
    </div>
  );
}

function Row({ line, side }: { line: Line; side: "old" | "new" | "unified" }) {
  const tone =
    line.kind === "add"
      ? "bg-emerald-500/10"
      : line.kind === "del"
        ? "bg-rose-500/10"
        : "";
  const glyph = line.kind === "add" ? "+" : line.kind === "del" ? "−" : " ";
  const glyphColor =
    line.kind === "add"
      ? "text-emerald-300"
      : line.kind === "del"
        ? "text-rose-300"
        : "text-white/25";

  return (
    <div className={cn("flex", tone)}>
      {side !== "new" ? (
        <span className="w-10 px-2 text-right text-white/30 select-none shrink-0">
          {line.oldNum ?? ""}
        </span>
      ) : null}
      {side !== "old" ? (
        <span className="w-10 px-2 text-right text-white/30 select-none shrink-0">
          {line.newNum ?? ""}
        </span>
      ) : null}
      <span className={cn("w-4 text-center select-none shrink-0", glyphColor)}>
        {glyph}
      </span>
      <span className="flex-1 whitespace-pre pr-3 text-white/85">{line.text}</span>
    </div>
  );
}
