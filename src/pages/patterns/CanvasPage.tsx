import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import {
  Canvas,
  CanvasConnection,
  CanvasItem,
  CanvasMarquee,
  CanvasMinimap,
  CanvasPanel,
  CanvasRuler,
  CanvasStatusBar,
  CanvasToolbar,
  CanvasZoomControls,
  rectContains,
  type CanvasHandle,
  type CanvasToolbarItem,
} from "../../components";
import {
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "../../components";
import {
  Spark,
  TrashIcon,
  CopyIcon,
  MagnifierIcon,
} from "../../showcase/icons";

type Tool =
  | "select"
  | "pan"
  | "rect"
  | "text"
  | "connect"
  | "erase";

type ItemKind = "rect" | "text" | "node";

interface Item {
  id: string;
  kind: ItemKind;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

let seq = 0;
const nextId = () => `i${++seq}`;

const initialItems: Item[] = [
  { id: nextId(), kind: "node", x: 80, y: 120, width: 200, height: 84, text: "Data source", color: "#38bdf8" },
  { id: nextId(), kind: "node", x: 420, y: 80, width: 200, height: 84, text: "Transform", color: "#a855f7" },
  { id: nextId(), kind: "node", x: 420, y: 240, width: 200, height: 84, text: "Filter", color: "#f472b6" },
  { id: nextId(), kind: "node", x: 760, y: 160, width: 200, height: 84, text: "Sink", color: "#34d399" },
  { id: nextId(), kind: "text", x: 120, y: 380, width: 280, height: 60, text: "Right-click anywhere for a menu." },
];
const initialConnections: Connection[] = [
  { id: "c1", from: "i1", to: "i2" },
  { id: "c2", from: "i1", to: "i3" },
  { id: "c3", from: "i2", to: "i4" },
  { id: "c4", from: "i3", to: "i4" },
];

const toolCursor: Record<Tool, CSSProperties["cursor"]> = {
  select: "default",
  pan: "grab",
  rect: "crosshair",
  text: "text",
  connect: "crosshair",
  erase: "not-allowed",
};

export function CanvasPage() {
  return (
    <Group
      id="canvas"
      title="Canvas · editor"
      desc="GPU-accelerated world with toolbar, menus, rulers, minimap, marquee select and node connections — the pieces for Figma/Miro/node-editor style apps."
    >
      <Demo
        title="Full editor"
        hint="Tools on the left · space+drag to pan · wheel to zoom · right-click for menus"
        wide
        intensity="soft"
      >
        <EditorDemo />
      </Demo>

      <Demo title="Cursor modes" hint="Different tools → different cursors" wide intensity="soft">
        <CursorShowcase />
      </Demo>

      <Demo title="Node editor · live connections" hint="Drag nodes — edges follow" wide intensity="soft">
        <NodeEditorDemo />
      </Demo>
    </Group>
  );
}

// === Full editor demo ======================================

function EditorDemo() {
  const canvasRef = useRef<CanvasHandle>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [items, setItems] = useState<Item[]>(initialItems);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingConnect, setPendingConnect] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);

  const itemById = useMemo(() => {
    const m = new Map<string, Item>();
    for (const it of items) m.set(it.id, it);
    return m;
  }, [items]);

  function createItem(kind: ItemKind, worldX: number, worldY: number, extra?: Partial<Item>) {
    const defaults: Record<ItemKind, Partial<Item>> = {
      rect: { width: 160, height: 100, color: "#a855f7" },
      text: { width: 200, height: 48, text: "Double-click to edit" },
      node: { width: 200, height: 84, text: "Node", color: "#38bdf8" },
    };
    const id = nextId();
    setItems((prev) => [
      ...prev,
      {
        id,
        kind,
        x: worldX - (defaults[kind].width ?? 100) / 2,
        y: worldY - (defaults[kind].height ?? 40) / 2,
        width: 100,
        height: 40,
        ...defaults[kind],
        ...extra,
      } as Item,
    ]);
    return id;
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setConnections((prev) => prev.filter((c) => c.from !== id && c.to !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }

  function duplicate(id: string) {
    const src = itemById.get(id);
    if (!src) return;
    setItems((prev) => [
      ...prev,
      { ...src, id: nextId(), x: src.x + 24, y: src.y + 24 },
    ]);
  }

  function handleItemClick(id: string) {
    if (tool === "erase") return removeItem(id);
    if (tool === "connect") {
      if (pendingConnect === null) {
        setPendingConnect(id);
      } else if (pendingConnect !== id) {
        setConnections((prev) => [
          ...prev,
          { id: `c${Date.now()}`, from: pendingConnect, to: id },
        ]);
        setPendingConnect(null);
      }
      return;
    }
    if (tool === "select") {
      setSelected(new Set([id]));
    }
  }

  const toolbarItems: CanvasToolbarItem[] = [
    {
      id: "select",
      label: "Select",
      shortcut: "V",
      icon: <Cursor />,
      active: tool === "select",
      onClick: () => setTool("select"),
    },
    {
      id: "pan",
      label: "Pan",
      shortcut: "H",
      icon: <Hand />,
      active: tool === "pan",
      onClick: () => setTool("pan"),
      divider: true,
    },
    {
      id: "rect",
      label: "Rectangle",
      shortcut: "R",
      icon: <Square />,
      active: tool === "rect",
      onClick: () => setTool("rect"),
    },
    {
      id: "text",
      label: "Text",
      shortcut: "T",
      icon: <TextGlyph />,
      active: tool === "text",
      onClick: () => setTool("text"),
    },
    {
      id: "connect",
      label: "Connect",
      shortcut: "C",
      icon: <Plug />,
      active: tool === "connect",
      onClick: () => {
        setTool("connect");
        setPendingConnect(null);
      },
      divider: true,
    },
    {
      id: "erase",
      label: "Erase",
      shortcut: "E",
      icon: <TrashIcon />,
      active: tool === "erase",
      onClick: () => setTool("erase"),
    },
  ];

  const canvasMenu = (
    <>
      <MenuLabel>Canvas</MenuLabel>
      <MenuItem
        icon={<Square />}
        shortcut="R"
        onClick={() => setTool("rect")}
      >
        Rectangle tool
      </MenuItem>
      <MenuItem
        icon={<TextGlyph />}
        shortcut="T"
        onClick={() => setTool("text")}
      >
        Text tool
      </MenuItem>
      <MenuSeparator />
      <MenuItem
        icon={<MagnifierIcon />}
        onClick={() => canvasRef.current?.fit()}
      >
        Fit to content
      </MenuItem>
      <MenuItem
        submenu={
          <>
            <MenuItem onClick={() => canvasRef.current?.zoomTo(0.5)}>
              50%
            </MenuItem>
            <MenuItem onClick={() => canvasRef.current?.zoomTo(1)}>
              100%
            </MenuItem>
            <MenuItem onClick={() => canvasRef.current?.zoomTo(1.5)}>
              150%
            </MenuItem>
            <MenuItem onClick={() => canvasRef.current?.zoomTo(2)}>
              200%
            </MenuItem>
          </>
        }
      >
        Zoom to…
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={() => canvasRef.current?.reset()}>
        Reset view
      </MenuItem>
    </>
  );

  return (
    <div className="w-full">
      <Canvas
        ref={canvasRef}
        grid="dots"
        gridSize={24}
        gridMajor={5}
        pan={tool === "pan" ? "always" : "space"}
        cursor={toolCursor[tool]}
        defaultTransform={{ x: 120, y: 80, zoom: 1 }}
        className="h-[640px] rounded-2xl border border-white/10 bg-[#0d0d14]"
        menu={({ worldX, worldY }) => (
          <>
            {canvasMenu}
            <MenuSeparator />
            <MenuItem
              onClick={() => createItem("rect", worldX, worldY)}
            >
              Add rectangle here
            </MenuItem>
            <MenuItem
              onClick={() => createItem("text", worldX, worldY)}
            >
              Add text here
            </MenuItem>
            <MenuItem
              onClick={() => createItem("node", worldX, worldY, { text: "New node" })}
            >
              Add node here
            </MenuItem>
          </>
        )}
        overlay={
          <>
            <CanvasRuler orientation="horizontal" />
            <CanvasRuler orientation="vertical" />
            <div className="absolute top-[22px] left-[22px] bottom-0 right-0 pointer-events-none">
              <CanvasToolbar
                items={toolbarItems}
                position="left"
                title="Tools"
              />
              <CanvasZoomControls position="top-right" />
              <CanvasMinimap position="bottom-right" size={180} />
              <CanvasStatusBar
                floating
                left={
                  <span className="uppercase tracking-wider text-[10px] text-fuchsia-300/80">
                    {tool}
                    {tool === "connect" && pendingConnect ? (
                      <span className="text-sky-300/80">
                        {" "}· from {itemById.get(pendingConnect)?.text ?? pendingConnect}
                      </span>
                    ) : null}
                  </span>
                }
                right={
                  <span className="text-white/40">
                    {items.length} items · {connections.length} edges · {selected.size} selected
                  </span>
                }
              />
              {showInspector ? (
                <CanvasPanel
                  title="Inspector"
                  defaultPosition={{ x: 420, y: 16 }}
                  width={220}
                  closable
                  onClose={() => setShowInspector(false)}
                >
                  {selected.size === 0 ? (
                    <p className="text-xs text-white/50">Select an item (V) to edit it.</p>
                  ) : selected.size === 1 ? (
                    <InspectorFields
                      item={itemById.get([...selected][0])!}
                      onChange={(patch) =>
                        setItems((prev) =>
                          prev.map((p) =>
                            p.id === [...selected][0] ? { ...p, ...patch } : p,
                          ),
                        )
                      }
                    />
                  ) : (
                    <p className="text-xs text-white/50">
                      {selected.size} items selected
                    </p>
                  )}
                </CanvasPanel>
              ) : null}
            </div>
          </>
        }
      >
        <CanvasMarquee
          enabled={tool === "select"}
          onSelect={(rect) => {
            const hit = items.filter((it) => rectContains(rect, it));
            setSelected(new Set(hit.map((h) => h.id)));
          }}
        />
        {connections.map((c) => {
          const a = itemById.get(c.from);
          const b = itemById.get(c.to);
          if (!a || !b) return null;
          return (
            <CanvasConnection
              key={c.id}
              from={{ x: a.x + a.width, y: a.y + a.height / 2 }}
              to={{ x: b.x, y: b.y + b.height / 2 }}
              arrow
              animated
            />
          );
        })}
        {items.map((it) => (
          <CanvasItem
            key={it.id}
            x={it.x}
            y={it.y}
            draggable={tool === "select"}
            onDrag={(pos) =>
              setItems((prev) =>
                prev.map((p) => (p.id === it.id ? { ...p, ...pos } : p)),
              )
            }
            menu={
              <>
                <MenuLabel>{it.text ?? it.kind}</MenuLabel>
                <MenuItem
                  icon={<CopyIcon />}
                  shortcut="⌘D"
                  onClick={() => duplicate(it.id)}
                >
                  Duplicate
                </MenuItem>
                <MenuItem
                  submenu={
                    <>
                      {["#a855f7", "#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#fb7185"].map(
                        (c) => (
                          <MenuItem
                            key={c}
                            onClick={() =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id ? { ...p, color: c } : p,
                                ),
                              )
                            }
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded"
                                style={{ background: c }}
                              />
                              {c}
                            </span>
                          </MenuItem>
                        ),
                      )}
                    </>
                  }
                >
                  Set color
                </MenuItem>
                <MenuSeparator />
                <MenuItem
                  icon={<TrashIcon />}
                  shortcut="⌫"
                  danger
                  onClick={() => removeItem(it.id)}
                >
                  Delete
                </MenuItem>
              </>
            }
          >
            <ItemView
              item={it}
              selected={selected.has(it.id)}
              isConnectSource={pendingConnect === it.id}
              onClick={() => handleItemClick(it.id)}
              tool={tool}
            />
          </CanvasItem>
        ))}
        <CanvasItem x={-40} y={-40} bounds={false} fixedSize>
          <div className="px-2 py-1 rounded-md bg-fuchsia-500/20 border border-fuchsia-400/40 text-fuchsia-100 text-[10px] uppercase tracking-widest">
            origin (0,0)
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

function InspectorFields({
  item,
  onChange,
}: {
  item: Item;
  onChange: (patch: Partial<Item>) => void;
}) {
  return (
    <div className="flex flex-col gap-3 text-xs">
      <FieldRow label="Name">
        <input
          value={item.text ?? ""}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full bg-white/5 rounded px-2 py-1 text-white outline-none border border-white/10 focus:border-fuchsia-400/60"
        />
      </FieldRow>
      <FieldRow label="X">
        <input
          type="number"
          value={Math.round(item.x)}
          onChange={(e) => onChange({ x: Number(e.target.value) })}
          className="w-full bg-white/5 rounded px-2 py-1 text-white tabular-nums font-mono outline-none border border-white/10 focus:border-fuchsia-400/60"
        />
      </FieldRow>
      <FieldRow label="Y">
        <input
          type="number"
          value={Math.round(item.y)}
          onChange={(e) => onChange({ y: Number(e.target.value) })}
          className="w-full bg-white/5 rounded px-2 py-1 text-white tabular-nums font-mono outline-none border border-white/10 focus:border-fuchsia-400/60"
        />
      </FieldRow>
      {item.color ? (
        <FieldRow label="Color">
          <input
            type="color"
            value={item.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="w-full h-7 bg-transparent border border-white/10 rounded cursor-pointer"
          />
        </FieldRow>
      ) : null}
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-wider text-white/40">
        {label}
      </span>
      {children}
    </label>
  );
}

function ItemView({
  item,
  selected,
  isConnectSource,
  onClick,
  tool,
}: {
  item: Item;
  selected: boolean;
  isConnectSource: boolean;
  onClick: () => void;
  tool: Tool;
}) {
  const ringCls = selected
    ? "ring-2 ring-fuchsia-400 ring-offset-2 ring-offset-[#0d0d14]"
    : isConnectSource
      ? "ring-2 ring-sky-400 ring-offset-2 ring-offset-[#0d0d14]"
      : "";

  const interactive = tool !== "select" ? "cursor-pointer" : "";

  if (item.kind === "text") {
    return (
      <div
        onClick={onClick}
        style={{ width: item.width, minHeight: item.height }}
        className={`px-3 py-2 text-sm text-white/85 rounded-md transition ${ringCls} ${interactive}`}
      >
        {item.text}
      </div>
    );
  }
  if (item.kind === "rect") {
    return (
      <div
        onClick={onClick}
        style={{
          width: item.width,
          height: item.height,
          background: `${item.color}20`,
          borderColor: `${item.color}aa`,
        }}
        className={`rounded-lg border-2 transition ${ringCls} ${interactive}`}
      />
    );
  }
  return (
    <div
      onClick={onClick}
      style={{ width: item.width, minHeight: item.height }}
      className={`rounded-xl bg-[#18182200] transition ${ringCls} ${interactive}`}
    >
      <div
        className="rounded-xl border backdrop-blur-sm p-3 flex flex-col gap-1 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]"
        style={{
          background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
          borderColor: `${item.color}66`,
        }}
      >
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: item.color }}
          />
          {item.kind}
        </div>
        <div className="text-white font-semibold">{item.text}</div>
        <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1">
          <span>
            in · {item.id}
          </span>
          <span>→</span>
          <span>out</span>
        </div>
      </div>
    </div>
  );
}

// === Cursor showcase =======================================

function CursorShowcase() {
  const [cursor, setCursor] = useState<CSSProperties["cursor"]>("crosshair");
  const options: { label: string; cursor: CSSProperties["cursor"] }[] = [
    { label: "default", cursor: "default" },
    { label: "crosshair", cursor: "crosshair" },
    { label: "grab / grabbing", cursor: "grab" },
    { label: "text", cursor: "text" },
    { label: "move", cursor: "move" },
    { label: "cell", cursor: "cell" },
    { label: "pointer", cursor: "pointer" },
    { label: "not-allowed", cursor: "not-allowed" },
  ];
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.label}
            onClick={() => setCursor(o.cursor)}
            className={`px-2.5 py-1 rounded-md text-xs border transition ${
              cursor === o.cursor
                ? "bg-fuchsia-500/20 border-fuchsia-400/60 text-fuchsia-100"
                : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06]"
            }`}
            style={{ cursor: o.cursor }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <Canvas
        grid="dots"
        gridSize={28}
        cursor={cursor}
        className="h-[280px] rounded-2xl border border-white/10 bg-[#0d0d14]"
      >
        <CanvasItem x={40} y={40}>
          <div className="px-3 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-sm text-white/80">
            The canvas cursor is{" "}
            <code className="text-fuchsia-300">{String(cursor)}</code> — try the
            chips above.
          </div>
        </CanvasItem>
      </Canvas>
    </div>
  );
}

// === Node editor demo ======================================

function NodeEditorDemo() {
  const [nodes, setNodes] = useState(() => [
    { id: "a", x: 80, y: 80, title: "Fetch", sub: "HTTP · GET" },
    { id: "b", x: 360, y: 40, title: "Parse JSON", sub: "text → object" },
    { id: "c", x: 360, y: 200, title: "Transform", sub: "map · filter" },
    { id: "d", x: 640, y: 120, title: "Publish", sub: "NATS · topic" },
  ]);
  const edges = [
    { from: "a", to: "b" },
    { from: "a", to: "c" },
    { from: "b", to: "d" },
    { from: "c", to: "d" },
  ];
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <Canvas
      grid="dots"
      gridSize={20}
      defaultTransform={{ x: 40, y: 40, zoom: 1 }}
      className="h-[420px] rounded-2xl border border-white/10 bg-[#0d0d14]"
      overlay={
        <>
          <CanvasZoomControls position="bottom-right" />
          <CanvasStatusBar floating left={<span className="text-white/50">Drag a node to watch the edges flex</span>} />
        </>
      }
    >
      {edges.map((e, i) => {
        const a = byId.get(e.from)!;
        const b = byId.get(e.to)!;
        return (
          <CanvasConnection
            key={i}
            from={{ x: a.x + 200, y: a.y + 40 }}
            to={{ x: b.x, y: b.y + 40 }}
            arrow
            animated
          />
        );
      })}
      {nodes.map((n) => (
        <CanvasItem
          key={n.id}
          x={n.x}
          y={n.y}
          draggable
          onDrag={(p) =>
            setNodes((prev) =>
              prev.map((pp) => (pp.id === n.id ? { ...pp, ...p } : pp)),
            )
          }
        >
          <div className="w-[200px] rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-sky-500/10 border border-fuchsia-400/30 p-3 flex flex-col gap-0.5 shadow-[0_12px_40px_-12px_rgba(168,85,247,0.4)]">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60">
              <Spark />
              node · {n.id}
            </div>
            <div className="text-white font-semibold">{n.title}</div>
            <div className="text-xs text-white/50">{n.sub}</div>
          </div>
        </CanvasItem>
      ))}
    </Canvas>
  );
}

// === Inline icons ==========================================

function Cursor() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3 L4 18 L9 13 L12 20 L14 19 L11 12 L18 12 Z" />
    </svg>
  );
}
function Hand() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 11V7a2 2 0 1 1 4 0v4" />
      <path d="M9 11V5a2 2 0 1 1 4 0v6" />
      <path d="M13 11V6a2 2 0 1 1 4 0v9" />
      <path d="M17 11a2 2 0 1 1 4 0v4a7 7 0 0 1-7 7h-2a6 6 0 0 1-6-6v-4" />
    </svg>
  );
}
function Square() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
function TextGlyph() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 5h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
function Plug() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="12" r="3" />
      <path d="M9 12h6" />
    </svg>
  );
}
