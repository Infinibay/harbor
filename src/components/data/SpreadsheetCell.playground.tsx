import { useState } from "react";
import {
  SpreadsheetCell,
  type SpreadsheetCellStyle,
} from "./SpreadsheetCell";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

function SpreadsheetCellDemo() {
  const [value, setValue] = useState("=SUM(B2:B8)");
  const [selected, setSelected] = useState(true);
  const [editing, setEditing] = useState(false);
  const [style, setStyle] = useState<SpreadsheetCellStyle>({
    bold: true,
    fontSize: 13,
    fontFamily: "mono",
    color: "accent",
    backgroundColor: "muted",
    textAlign: "right",
    border: { color: "accent", style: "double", width: 2 },
  });

  return (
    <div className="grid w-full max-w-xl gap-4">
      <div className="overflow-hidden rounded-[var(--harbor-target-radius)] border border-border-strong bg-surface-1">
        <div className="grid grid-cols-[44px_minmax(180px,1fr)] border-b border-border text-xs text-fg-muted">
          <div className="grid h-7 place-items-center border-r border-border">A</div>
          <div className="grid h-7 place-items-center">B</div>
        </div>
        <div className="grid grid-cols-[44px_minmax(180px,1fr)]">
          <div className="grid h-9 place-items-center border-r border-border text-xs text-fg-muted">1</div>
          <SpreadsheetCell
            id="B1"
            value={value}
            displayValue="$24,800"
            style={style}
            selected={selected}
            inSelection={selected}
            editing={editing}
            numeric
            formula
            onSelect={(_id, options) => {
              setSelected(true);
              if (options.edit) setEditing(true);
            }}
            onEditStart={() => setEditing(true)}
            onEditEnd={() => setEditing(false)}
            onValueChange={(_id, next) => setValue(next)}
            onClear={() => setValue("")}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setStyle((current) => ({ ...current, bold: !current.bold }))}>Bold</button>
        <button className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setStyle((current) => ({ ...current, italic: !current.italic }))}>Italic</button>
        <button className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setStyle((current) => ({ ...current, underline: !current.underline }))}>Underline</button>
        <button className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setStyle((current) => ({ ...current, backgroundColor: "success" }))}>Success fill</button>
        <button className="rounded-md border border-border px-3 py-1 text-xs" onClick={() => setStyle((current) => ({ ...current, border: { color: "danger", style: "dotted", width: 3 } }))}>Dotted border</button>
      </div>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SpreadsheetCellDemo as never,
  importPath: "@infinibay/harbor/data",
  controls: {},
  variants: [
    { label: "Interactive formatted cell", props: {} },
  ],
  events: [
    { name: "onSelect", signature: "(id, { extend, edit }) => void" },
    { name: "onValueChange", signature: "(id, value) => void" },
    { name: "onNavigate", signature: "(id, direction, { shift }) => void" },
  ],
};
