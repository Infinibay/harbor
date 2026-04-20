import { useState, type ReactNode } from "react";
import { Group, Demo } from "../../showcase/ShowcaseCard";
import {
  FlyoutToolbar,
  type FlyoutToolbarEntry,
} from "../../components/layout/FlyoutToolbar";

/**
 * Showcase for FlyoutToolbar — a compact tool rail that collapses related
 * items into group buttons with perpendicular flyout submenus. Hover (or
 * right-click) a group button to reveal its members; the active member is
 * shown as the group's icon so the rail stays narrow.
 */
export function FlyoutToolbarPage() {
  return (
    <div className="space-y-12">
      <header>
        <div className="text-[11px] uppercase tracking-[0.25em] text-fuchsia-300/70 mb-2">
          patterns · flyout toolbar
        </div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          FlyoutToolbar
        </h1>
        <p className="mt-2 text-white/55 max-w-3xl">
          Compact tool rail for canvas apps with many tools. Related icons
          collapse into a group button that shows the active member; hovering
          or right-clicking opens a perpendicular submenu with every member.
          Submenus are portalised, so they escape any{" "}
          <code className="font-mono text-fuchsia-200/80">overflow: hidden</code>{" "}
          /{" "}
          <code className="font-mono text-fuchsia-200/80">auto</code>{" "}
          ancestors on the host page.
        </p>
      </header>

      <Group id="basics" title="Basics" desc="Vertical rail with three groups and a single plain item.">
        <Demo title="Vertical rail · 3 groups + 1 item" intensity="soft">
          <VerticalDemo />
        </Demo>
        <Demo title="Horizontal rail · same data, horizontal" intensity="soft">
          <HorizontalDemo />
        </Demo>
      </Group>

      <Group id="overflow" title="Escaping clipped ancestors" desc="The submenu renders in a Portal so it never gets clipped.">
        <Demo title="Inside overflow:hidden container" intensity="soft" wide>
          <ClippedDemo />
        </Demo>
      </Group>

      <Group id="trailing" title="Trailing slot" desc="Use the `trailing` prop to append a gear or 'more' button after the groups.">
        <Demo title="Rail with settings gear" intensity="soft">
          <TrailingDemo />
        </Demo>
      </Group>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Icons — inline SVGs so the showcase has no external deps.
   ──────────────────────────────────────────────────────────── */

function CursorIcon() {
  return <Svg><path d="M5 3l6 16 2-7 7-2L5 3z" /></Svg>;
}
function LineIcon() { return <Svg><line x1="4" y1="20" x2="20" y2="4" /></Svg>; }
function DoubleLineIcon() { return <Svg><line x1="3" y1="18" x2="19" y2="2" /><line x1="6" y1="22" x2="22" y2="6" /></Svg>; }
function TripleLineIcon() { return <Svg><line x1="3" y1="17" x2="17" y2="3" /><line x1="5" y1="20" x2="19" y2="6" /><line x1="8" y1="22" x2="22" y2="8" /></Svg>; }
function CurveIcon() { return <Svg><path d="M4 18c4-10 12-10 16 0" /></Svg>; }
function SquareIcon() { return <Svg><rect x="5" y="5" width="14" height="14" rx="1.5" /></Svg>; }
function CircleIcon() { return <Svg><circle cx="12" cy="12" r="7" /></Svg>; }
function TriangleIcon() { return <Svg><path d="M12 4 L20 19 L4 19 Z" /></Svg>; }
function TextIcon() { return <Svg><path d="M6 4h12M12 4v16" /></Svg>; }
function ArrowIcon() { return <Svg><path d="M5 12h13M13 6l6 6-6 6" /></Svg>; }
function EraseIcon() { return <Svg><path d="M15 4l5 5-10 10H5v-5L15 4z" /></Svg>; }
function SettingsIcon() { return <Svg><circle cx="12" cy="12" r="2.6" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></Svg>; }

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Demos
   ──────────────────────────────────────────────────────────── */

function useDemoTool(initial = "line1") {
  return useState(initial);
}

function buildEntries(tool: string, setTool: (t: string) => void): FlyoutToolbarEntry[] {
  return [
    {
      kind: "item",
      item: { id: "select", icon: <CursorIcon />, label: "Select", shortcut: "V", active: tool === "select", onClick: () => setTool("select") },
    },
    {
      kind: "group",
      group: {
        id: "line",
        label: "Lines",
        divider: true,
        items: [
          { id: "line1", icon: <LineIcon />,       label: "Single",  shortcut: "1", active: tool === "line1", onClick: () => setTool("line1") },
          { id: "line2", icon: <DoubleLineIcon />, label: "Double",  shortcut: "2", active: tool === "line2", onClick: () => setTool("line2") },
          { id: "line3", icon: <TripleLineIcon />, label: "Triple",  shortcut: "3", active: tool === "line3", onClick: () => setTool("line3") },
          { id: "curve", icon: <CurveIcon />,      label: "Curve",   shortcut: "C", active: tool === "curve", onClick: () => setTool("curve") },
        ],
      },
    },
    {
      kind: "group",
      group: {
        id: "shape",
        label: "Shapes",
        items: [
          { id: "sq",  icon: <SquareIcon />,   label: "Square",   shortcut: "R", active: tool === "sq",  onClick: () => setTool("sq") },
          { id: "ci",  icon: <CircleIcon />,   label: "Circle",   shortcut: "O", active: tool === "ci",  onClick: () => setTool("ci") },
          { id: "tri", icon: <TriangleIcon />, label: "Triangle",                 active: tool === "tri", onClick: () => setTool("tri") },
        ],
        divider: true,
      },
    },
    {
      kind: "group",
      group: {
        id: "decoration",
        label: "Decoration",
        items: [
          { id: "text",  icon: <TextIcon />,  label: "Text",  shortcut: "T", active: tool === "text",  onClick: () => setTool("text") },
          { id: "arrow", icon: <ArrowIcon />, label: "Arrow",                active: tool === "arrow", onClick: () => setTool("arrow") },
        ],
      },
    },
    {
      kind: "item",
      item: { id: "erase", icon: <EraseIcon />, label: "Erase", shortcut: "E", active: tool === "erase", onClick: () => setTool("erase") },
    },
  ];
}

function VerticalDemo() {
  const [tool, setTool] = useDemoTool();
  return (
    <div className="flex items-start gap-6">
      <FlyoutToolbar entries={buildEntries(tool, setTool)} orientation="vertical" floating={false} />
      <div className="text-sm text-white/60 font-mono self-center">
        tool = <span className="text-fuchsia-200">{tool}</span>
      </div>
    </div>
  );
}

function HorizontalDemo() {
  const [tool, setTool] = useDemoTool("sq");
  return (
    <div className="flex flex-col items-center gap-4">
      <FlyoutToolbar entries={buildEntries(tool, setTool)} orientation="horizontal" floating={false} />
      <div className="text-sm text-white/60 font-mono">
        tool = <span className="text-fuchsia-200">{tool}</span>
      </div>
    </div>
  );
}

function ClippedDemo() {
  const [tool, setTool] = useDemoTool();
  return (
    <div className="w-full flex justify-center">
      <div className="relative h-[220px] w-full max-w-lg rounded-xl border border-white/10 bg-white/[0.02] overflow-auto">
        <div className="p-4 text-[10px] text-white/40 font-mono">
          overflow: auto; the rail is inside this clipped box
        </div>
        <div className="absolute top-10 left-4">
          <FlyoutToolbar entries={buildEntries(tool, setTool)} orientation="vertical" floating={false} />
        </div>
        <div className="h-[400px]" />
      </div>
    </div>
  );
}

function TrailingDemo() {
  const [tool, setTool] = useDemoTool("curve");
  return (
    <div className="flex items-start gap-6">
      <FlyoutToolbar
        entries={buildEntries(tool, setTool)}
        orientation="vertical"
        floating={false}
        trailing={
          <button
            className="w-9 h-9 rounded-lg grid place-items-center text-white/50 hover:bg-white/5 hover:text-white"
            title="Settings"
          >
            <SettingsIcon />
          </button>
        }
      />
      <div className="text-sm text-white/60 font-mono self-center">
        tool = <span className="text-fuchsia-200">{tool}</span>
      </div>
    </div>
  );
}
