import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Group, Demo, Row } from "../../showcase/ShowcaseCard";
import {
  Canvas,
  CanvasConnection,
  CanvasFloat,
  CanvasFollowPath,
  CanvasItem,
  CanvasJiggle,
  CanvasMarquee,
  CanvasMinimap,
  CanvasOrbit,
  CanvasPanel,
  CanvasPulse,
  CanvasRuler,
  CanvasSelectionBox,
  CanvasShortcuts,
  CanvasStatusBar,
  CanvasToolbar,
  CanvasZoomControls,
  rectContains,
  type CanvasHandle,
  type CanvasToolbarItem,
} from "../../components";
import { useCanvasHistory } from "../../lib/useCanvasHistory";
import { useCanvasSelection } from "../../lib/useCanvasSelection";
import {
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "../../components";
import { Button } from "../../components";
import { stagger, useCanvasTimeline } from "../../lib/canvas-animation";
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

      <Demo
        title="Animated CanvasItem"
        hint="`transition` prop — change x/y and it springs"
        wide
        intensity="soft"
      >
        <AnimatedLayoutDemo />
      </Demo>

      <Demo
        title="Motion primitives"
        hint="Orbit · Pulse · Float · Jiggle · FollowPath"
        wide
        intensity="soft"
      >
        <PrimitivesDemo />
      </Demo>

      <Demo
        title="Timeline walkthrough"
        hint="Scripted sequence via `useCanvasTimeline`"
        wide
        intensity="soft"
      >
        <TimelineDemo />
      </Demo>

      <Demo
        title="Stagger cascade"
        hint="`stagger({ each, order: 'center' })` — coordinated entry"
        wide
        intensity="soft"
      >
        <StaggerDemo />
      </Demo>

      <Demo
        title="Pro editor · selection + undo + shortcuts"
        hint="Shift/Cmd click · drag-select · Cmd+D dup · Del · arrows nudge · Cmd+Z undo"
        wide
        intensity="soft"
      >
        <ProEditorDemo />
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

// === Animated layout demo =================================

const ANIM_LAYOUTS = {
  grid: [
    { x: 60, y: 60 }, { x: 220, y: 60 }, { x: 380, y: 60 },
    { x: 60, y: 180 }, { x: 220, y: 180 }, { x: 380, y: 180 },
  ],
  row: [
    { x: 60, y: 120 }, { x: 170, y: 120 }, { x: 280, y: 120 },
    { x: 390, y: 120 }, { x: 500, y: 120 }, { x: 610, y: 120 },
  ],
  circle: Array.from({ length: 6 }, (_, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
    return { x: 340 + Math.cos(angle) * 120 - 40, y: 160 + Math.sin(angle) * 120 - 28 };
  }),
  stack: [
    { x: 320, y: 40 }, { x: 340, y: 70 }, { x: 360, y: 100 },
    { x: 380, y: 130 }, { x: 400, y: 160 }, { x: 420, y: 190 },
  ],
};

function AnimatedLayoutDemo() {
  const [layout, setLayout] = useState<keyof typeof ANIM_LAYOUTS>("grid");
  const positions = ANIM_LAYOUTS[layout];
  const colors = ["#a855f7", "#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#fb7185"];
  return (
    <div className="w-full flex flex-col gap-3">
      <Row className="gap-2">
        {(Object.keys(ANIM_LAYOUTS) as (keyof typeof ANIM_LAYOUTS)[]).map((l) => (
          <Button
            key={l}
            size="sm"
            variant={layout === l ? "primary" : "ghost"}
            onClick={() => setLayout(l)}
          >
            {l}
          </Button>
        ))}
      </Row>
      <Canvas
        grid="dots"
        gridSize={24}
        className="h-[320px] rounded-2xl border border-white/10 bg-[#0d0d14]"
      >
        {positions.map((p, i) => (
          <CanvasItem
            key={i}
            x={p.x}
            y={p.y}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: i * 0.04 }}
          >
            <div
              className="w-[80px] h-[56px] rounded-xl border-2"
              style={{
                background: `${colors[i]}22`,
                borderColor: `${colors[i]}99`,
                boxShadow: `0 10px 30px -10px ${colors[i]}66`,
              }}
            />
          </CanvasItem>
        ))}
      </Canvas>
    </div>
  );
}

// === Motion primitives demo ================================

function PrimitivesDemo() {
  return (
    <Canvas
      grid="dots"
      gridSize={24}
      className="h-[420px] rounded-2xl border border-white/10 bg-[#0d0d14]"
    >
      <CanvasItem x={180} y={220} fixedSize>
        <div className="w-4 h-4 rounded-full bg-fuchsia-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
      </CanvasItem>
      <CanvasOrbit cx={200} cy={230} radius={80} duration={5}>
        <div className="w-8 h-8 rounded-full bg-sky-400 shadow-[0_0_16px_rgba(56,189,248,0.7)]" />
      </CanvasOrbit>
      <CanvasOrbit cx={200} cy={230} radius={120} duration={9} startAngle={120}>
        <div className="w-6 h-6 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
      </CanvasOrbit>
      <CanvasOrbit cx={200} cy={230} radius={160} duration={14} startAngle={260}>
        <div className="w-5 h-5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]" />
      </CanvasOrbit>

      <CanvasItem x={480} y={60}>
        <CanvasPulse scale={[1, 1.15]} opacity={[0.75, 1]} duration={1.4}>
          <div className="px-3 py-2 rounded-xl bg-rose-500/20 border border-rose-400/50 text-rose-100 text-xs font-semibold">
            pulse
          </div>
        </CanvasPulse>
      </CanvasItem>

      <CanvasItem x={480} y={140}>
        <CanvasFloat amplitude={10} duration={2.6}>
          <div className="px-3 py-2 rounded-xl bg-sky-500/15 border border-sky-400/40 text-sky-100 text-xs font-semibold">
            float
          </div>
        </CanvasFloat>
      </CanvasItem>

      <CanvasItem x={480} y={220}>
        <CanvasJiggle amplitude={2.5} frequency={4} rotate>
          <div className="px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-100 text-xs font-semibold">
            jiggle
          </div>
        </CanvasJiggle>
      </CanvasItem>

      <CanvasFollowPath
        d="M 60 340 C 180 340 200 260 320 260 S 520 380 640 340"
        duration={4}
        rotate
        showPath
      >
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-fuchsia-500/90 text-white text-[10px] font-semibold shadow-[0_0_20px_rgba(168,85,247,0.6)]">
          <Spark />
          packet →
        </div>
      </CanvasFollowPath>
    </Canvas>
  );
}

// === Timeline demo =========================================

function TimelineDemo() {
  const tl = useCanvasTimeline();
  const xA = useMotionValue(60);
  const yA = useMotionValue(80);
  const xB = useMotionValue(60);
  const yB = useMotionValue(200);
  const xC = useMotionValue(60);
  const yC = useMotionValue(320);
  const opA = useMotionValue(1);

  function play() {
    tl.reset();
    tl.to(xA, 260, { at: 0, duration: 0.5 })
      .to(xB, 260, { at: 0.15, duration: 0.5 })
      .to(xC, 260, { at: 0.3, duration: 0.5 })
      .to(yA, 200, { at: 0.8, duration: 0.6 })
      .to(yB, 200, { at: 0.8, duration: 0.6 })
      .to(yC, 200, { at: 0.8, duration: 0.6 })
      .to(xA, 520, { at: 1.6, duration: 0.6 })
      .to(xB, 520, { at: 1.6, duration: 0.6 })
      .to(xC, 520, { at: 1.6, duration: 0.6 })
      .to(opA, 0, { at: 2.3, duration: 0.3 })
      .to(opA, 1, { at: 2.7, duration: 0.3 })
      .call(() => console.info("timeline complete"), 3.2)
      .play();
  }

  function reset() {
    tl.reset();
    xA.set(60); yA.set(80);
    xB.set(60); yB.set(200);
    xC.set(60); yC.set(320);
    opA.set(1);
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <Row className="gap-2">
        <Button size="sm" onClick={play}>Play</Button>
        <Button size="sm" variant="ghost" onClick={reset}>Reset</Button>
        <span className="text-xs text-white/40 tabular-nums font-mono">
          duration {tl.duration.toFixed(2)}s · {tl.isPlaying ? "playing" : "idle"}
        </span>
      </Row>
      <Canvas
        grid="lines"
        gridSize={40}
        className="h-[420px] rounded-2xl border border-white/10 bg-[#0d0d14]"
      >
        <TimelineNode x={xA} y={yA} opacity={opA} label="Ingest" color="#38bdf8" />
        <TimelineNode x={xB} y={yB} label="Transform" color="#a855f7" />
        <TimelineNode x={xC} y={yC} label="Publish" color="#34d399" />
      </Canvas>
    </div>
  );
}

function TimelineNode({
  x,
  y,
  opacity,
  label,
  color,
}: {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
  opacity?: ReturnType<typeof useMotionValue<number>>;
  label: string;
  color: string;
}) {
  // motion.div reads the values directly — zero React re-renders per frame.
  return (
    <motion.div
      data-canvas-bounds=""
      style={{ position: "absolute", top: 0, left: 0, x, y, opacity }}
    >
      <div
        className="w-32 h-16 rounded-xl border flex items-center justify-center text-sm font-semibold text-white"
        style={{
          background: `linear-gradient(135deg, ${color}30, ${color}10)`,
          borderColor: `${color}88`,
          boxShadow: `0 12px 40px -12px ${color}80`,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}

// === Stagger cascade =======================================

// === Pro editor demo (Pack A) =================================

interface ProItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
}

function makeId() {
  return `p${Math.random().toString(36).slice(2, 8)}`;
}

const PRO_INITIAL: ProItem[] = [
  { id: "p1", x: 80, y: 80, width: 180, height: 80, color: "#a855f7", text: "API gateway" },
  { id: "p2", x: 320, y: 80, width: 180, height: 80, color: "#38bdf8", text: "Auth" },
  { id: "p3", x: 560, y: 80, width: 180, height: 80, color: "#f472b6", text: "Worker" },
  { id: "p4", x: 80, y: 220, width: 180, height: 80, color: "#34d399", text: "DB" },
  { id: "p5", x: 320, y: 220, width: 180, height: 80, color: "#fbbf24", text: "Cache" },
  { id: "p6", x: 560, y: 220, width: 180, height: 80, color: "#fb7185", text: "Queue" },
];

function ProEditorDemo() {
  const history = useCanvasHistory<{ items: ProItem[] }>({ items: PRO_INITIAL });
  const items = history.state.items;
  const selection = useCanvasSelection();

  // Mutators that go through history. `commit({ transient })` during
  // drag avoids filling the stack; the final commit seals the action.
  const setItems = (next: ProItem[], label?: string, transient?: boolean) =>
    history.commit({ items: next }, { label, transient });

  const moveSelected = (dx: number, dy: number, phase: "drag" | "end") => {
    const next = items.map((it) =>
      selection.has(it.id) ? { ...it, x: it.x + dx, y: it.y + dy } : it,
    );
    setItems(next, "move", phase === "drag");
  };

  const resizeSelected = (
    dx: number,
    dy: number,
    corner: string,
    phase: "drag" | "end",
  ) => {
    // Single-item resize: translate corner + resize width/height.
    if (selection.size !== 1) return;
    const id = [...selection.ids][0];
    const next = items.map((it) => {
      if (it.id !== id) return it;
      let { x, y, width, height } = it;
      if (corner.includes("n")) {
        y += dy;
        height -= dy;
      }
      if (corner.includes("s")) height += dy;
      if (corner.includes("w")) {
        x += dx;
        width -= dx;
      }
      if (corner.includes("e")) width += dx;
      return { ...it, x, y, width: Math.max(24, width), height: Math.max(24, height) };
    });
    setItems(next, "resize", phase === "drag");
  };

  const deleteSelected = () => {
    if (selection.isEmpty) return;
    setItems(
      items.filter((it) => !selection.has(it.id)),
      `delete ${selection.size}`,
    );
    selection.clear();
  };

  const duplicateSelected = () => {
    if (selection.isEmpty) return;
    const clones: ProItem[] = [];
    const nextIds: string[] = [];
    for (const it of items) {
      if (!selection.has(it.id)) continue;
      const id = makeId();
      nextIds.push(id);
      clones.push({ ...it, id, x: it.x + 24, y: it.y + 24 });
    }
    setItems([...items, ...clones], `duplicate ${clones.length}`);
    selection.set(nextIds);
  };

  const nudge = ({ dx, dy }: { dx: number; dy: number; big: boolean }) => {
    if (selection.isEmpty) return;
    const next = items.map((it) =>
      selection.has(it.id) ? { ...it, x: it.x + dx, y: it.y + dy } : it,
    );
    setItems(next, "nudge");
  };

  const handleItemPointerDown = (id: string) => (e: React.MouseEvent) => {
    selection.onPointerDown(id, e);
  };

  // Drag across items — when moving a selected item, move all selected.
  const handleItemDragStart = (id: string) => {
    if (!selection.has(id)) {
      selection.set([id]);
    }
  };
  const onItemDrag = (id: string, pos: { x: number; y: number }) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    const dx = pos.x - it.x;
    const dy = pos.y - it.y;
    if (dx === 0 && dy === 0) return;
    const selected = selection.has(id) ? selection.ids : new Set([id]);
    const next = items.map((p) =>
      selected.has(p.id) ? { ...p, x: p.x + dx, y: p.y + dy } : p,
    );
    history.commit({ items: next }, { transient: true, label: "move" });
  };
  const onItemDragEnd = (id: string) => {
    // Seal the last transient commit as a non-transient entry.
    history.commit(history.state, { label: "move" });
    // suppress unused warning
    void id;
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <Row className="gap-2 items-center">
        <span className="text-[10px] uppercase tracking-widest text-white/40">
          history
        </span>
        <Button size="sm" variant="ghost" disabled={!history.canUndo} onClick={() => history.undo()}>
          Undo
        </Button>
        <Button size="sm" variant="ghost" disabled={!history.canRedo} onClick={() => history.redo()}>
          Redo
        </Button>
        <span className="text-xs text-white/40 tabular-nums font-mono">
          {history.cursor + 1} / {history.stack.length}
        </span>
        <span className="flex-1" />
        <span className="text-xs text-white/40 tabular-nums font-mono">
          {selection.size} selected
        </span>
      </Row>
      <CanvasShortcuts
        onDelete={deleteSelected}
        onDuplicate={duplicateSelected}
        onSelectAll={() => selection.set(items.map((i) => i.id))}
        onEscape={() => selection.clear()}
        onNudge={nudge}
        onUndo={() => history.undo()}
        onRedo={() => history.redo()}
      />
      <Canvas
        grid="dots"
        gridSize={24}
        className="h-[520px] rounded-2xl border border-white/10 bg-[#0d0d14]"
        overlay={
          <>
            <CanvasZoomControls position="top-right" />
            <CanvasStatusBar
              floating
              left={
                <span className="uppercase tracking-wider text-[10px] text-fuchsia-300/80">
                  {selection.size === 0
                    ? "empty"
                    : selection.size === 1
                      ? `1 item`
                      : `${selection.size} items`}
                </span>
              }
              right={
                <span className="text-white/40">
                  shift/cmd+click · marquee · del · ⌘D · arrows · ⌘Z
                </span>
              }
            />
            <CanvasSelectionBox
              ids={selection.ids}
              items={items}
              onResize={({ dx, dy, corner, phase }) =>
                resizeSelected(dx, dy, corner, phase)
              }
            />
          </>
        }
      >
        <CanvasMarquee
          items={items}
          onSelection={(ids) => selection.set(ids)}
          onSelectionDrag={(ids) => selection.set(ids)}
        />
        {items.map((it) => {
          const sel = selection.has(it.id);
          return (
            <CanvasItem
              key={it.id}
              x={it.x}
              y={it.y}
              draggable
              onDragStart={() => handleItemDragStart(it.id)}
              onDrag={(pos) => onItemDrag(it.id, pos)}
              onDragEnd={() => onItemDragEnd(it.id)}
            >
              <div
                onMouseDown={handleItemPointerDown(it.id)}
                style={{
                  width: it.width,
                  height: it.height,
                  background: `${it.color}22`,
                  borderColor: `${it.color}99`,
                  boxShadow: sel
                    ? `0 0 0 2px rgb(56 189 248), 0 12px 40px -12px ${it.color}66`
                    : `0 12px 40px -12px ${it.color}66`,
                }}
                className="rounded-xl border-2 flex items-center justify-center text-sm font-semibold text-white/90 select-none"
              >
                {it.text}
              </div>
            </CanvasItem>
          );
        })}
      </Canvas>
    </div>
  );
}

function StaggerDemo() {
  const [mode, setMode] = useState<"first" | "last" | "center" | "random">("center");
  const [tick, setTick] = useState(0);
  const cols = 10;
  const rows = 4;
  const delay = useMemo(
    () => stagger({ each: 0.04, order: mode }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, tick],
  );
  const total = cols * rows;

  return (
    <div className="w-full flex flex-col gap-3">
      <Row className="gap-2">
        {(["first", "last", "center", "random"] as const).map((m) => (
          <Button
            key={m}
            size="sm"
            variant={mode === m ? "primary" : "ghost"}
            onClick={() => {
              setMode(m);
              setTick((n) => n + 1);
            }}
          >
            {m}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setTick((n) => n + 1)}>
          Replay
        </Button>
      </Row>
      <Canvas
        key={tick}
        grid="dots"
        gridSize={20}
        className="h-[260px] rounded-2xl border border-white/10 bg-[#0d0d14]"
      >
        {Array.from({ length: total }).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <CanvasItem key={i} x={80 + col * 56} y={40 + row * 52}>
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotate: -12 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 22,
                  delay: delay(i, total),
                }}
                className="w-10 h-10 rounded-lg"
                style={{
                  background: `hsl(${280 + (i / total) * 80} 90% 60% / 0.25)`,
                  border: `1px solid hsl(${280 + (i / total) * 80} 90% 70% / 0.6)`,
                }}
              />
            </CanvasItem>
          );
        })}
      </Canvas>
    </div>
  );
}
