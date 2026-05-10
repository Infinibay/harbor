import {
  Fragment,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../../lib/cn";
import {
  Canvas,
  CanvasItem,
  type CanvasHandle,
  type CanvasProps,
} from "./Canvas";
import { CanvasConnection, type CanvasConnectionProps } from "./CanvasConnection";
import { CanvasMarquee } from "./CanvasMarquee";
import { CanvasMinimap } from "./CanvasMinimap";
import { CanvasSelectionBox } from "./CanvasSelectionBox";
import { CanvasSnapGuides } from "./CanvasSnapGuides";
import { CanvasStatusBar } from "./CanvasStatusBar";
import { CanvasZoomControls } from "./CanvasZoomControls";
import type { GraphPortSide, GraphPortSpec } from "./GraphNode";

export interface GraphCanvasNode<Data = unknown> {
  id: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  ports?: GraphPortSpec[];
  data?: Data;
}

export interface GraphCanvasEdge<Data = unknown> {
  id: string;
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
  label?: ReactNode;
  data?: Data;
}

export interface GraphCanvasRenderNodeArgs<NodeData = unknown> {
  node: GraphCanvasNode<NodeData>;
  selected: boolean;
}

export interface GraphCanvasRenderEdgeArgs<NodeData = unknown, EdgeData = unknown> {
  edge: GraphCanvasEdge<EdgeData>;
  from: GraphCanvasNode<NodeData>;
  to: GraphCanvasNode<NodeData>;
  selected: boolean;
}

export interface GraphCanvasConnectArgs {
  from: string;
  fromPort: string;
  to: string;
  toPort: string;
}

export interface GraphCanvasConnectEndArgs {
  from: string;
  fromPort: string;
  fromSide: GraphPortSide;
  position: { x: number; y: number };
  screenPosition: { x: number; y: number };
}

export interface GraphCanvasProps<NodeData = unknown, EdgeData = unknown> {
  nodes: GraphCanvasNode<NodeData>[];
  edges: GraphCanvasEdge<EdgeData>[];
  selectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  onSelectedEdgeIdsChange?: (ids: string[]) => void;
  onNodeMove?: (nodeId: string, position: { x: number; y: number }) => void;
  onConnect?: (connection: GraphCanvasConnectArgs) => void;
  onConnectEnd?: (connection: GraphCanvasConnectEndArgs) => void;
  onSelectionMove?: (
    delta: { dx: number; dy: number },
    phase: "drag" | "end",
  ) => void;
  renderNode: (args: GraphCanvasRenderNodeArgs<NodeData>) => ReactNode;
  renderEdge?: (args: GraphCanvasRenderEdgeArgs<NodeData, EdgeData>) => ReactNode;
  nodeMenu?: (args: GraphCanvasRenderNodeArgs<NodeData>) => ReactNode;
  onEdgeContextMenu?: (event: ReactMouseEvent, args: GraphCanvasRenderEdgeArgs<NodeData, EdgeData>) => void;
  canvasMenu?: CanvasProps["menu"];
  nodeSize?: { width: number; height: number };
  edgeCurve?: CanvasConnectionProps["curve"];
  edgeColor?: string;
  edgeActiveColor?: string;
  edgeEndpointPadding?: number;
  activeEdgeIds?: string[];
  selectedEdgeIds?: string[];
  portSize?: number;
  portGap?: number;
  selectionPadding?: number;
  showMinimap?: boolean;
  showZoomControls?: boolean;
  showStatusBar?: boolean;
  statusLeft?: ReactNode;
  statusRight?: ReactNode;
  overlay?: ReactNode;
  className?: string;
  canvasClassName?: string;
}

const DEFAULT_NODE_SIZE = { width: 220, height: 112 };

export const GraphCanvas = forwardRef<CanvasHandle, GraphCanvasProps>(
  function GraphCanvas(
    {
      nodes,
      edges,
      selectedIds = [],
      onSelectedIdsChange,
      onSelectedEdgeIdsChange,
      onNodeMove,
      onConnect,
      onConnectEnd,
      onSelectionMove,
      renderNode,
      renderEdge,
      nodeMenu,
      onEdgeContextMenu,
      canvasMenu,
      nodeSize = DEFAULT_NODE_SIZE,
      edgeCurve = "smart",
      edgeColor = "var(--harbor-graph-edge)",
      edgeActiveColor = "var(--harbor-graph-edge-active)",
      edgeEndpointPadding = 22,
      activeEdgeIds = [],
      selectedEdgeIds = [],
      portSize = 12,
      portGap = 8,
      selectionPadding = 8,
      showMinimap = true,
      showZoomControls = true,
      showStatusBar = true,
      statusLeft,
      statusRight,
      overlay,
      className,
      canvasClassName,
    },
    ref,
  ) {
    const canvasRef = useRef<CanvasHandle | null>(null);
    const [draftEdge, setDraftEdge] = useState<{
      fromNodeId: string;
      fromPortId: string;
      fromPoint: { x: number; y: number };
      fromSide: GraphPortSide;
      cursor: { x: number; y: number };
    } | null>(null);
    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
    const activeEdges = useMemo(() => new Set(activeEdgeIds), [activeEdgeIds]);
    const selectedEdges = useMemo(() => new Set(selectedEdgeIds), [selectedEdgeIds]);
    const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
    const bounds = useMemo(
      () => nodes.map((node) => ({
        id: node.id,
        x: node.x,
        y: node.y,
        width: node.width ?? nodeSize.width,
        height: node.height ?? nodeSize.height,
      })),
      [nodes, nodeSize.height, nodeSize.width],
    );
    const setCanvasRef = useCallback((handle: CanvasHandle | null) => {
      canvasRef.current = handle;
      assignRef(ref, handle);
    }, [ref]);

    const screenToWorld = useCallback((event: MouseEvent | ReactMouseEvent) => {
      const viewport = canvasRef.current?.getViewportElement();
      if (!canvasRef.current || !viewport) return null;
      const rect = viewport.getBoundingClientRect();
      return canvasRef.current.screenToWorld({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }, []);

    return (
      <div className={cn("relative h-full min-h-0 overflow-hidden", className)}>
        <Canvas
          ref={setCanvasRef}
          grid="dots"
          gridSize={32}
          pan="both"
          snap={{ grid: 24, threshold: 9 }}
          className={cn("bg-[var(--harbor-graph-canvas-bg)]", canvasClassName)}
          menu={canvasMenu}
          overlay={
            <>
              <CanvasSnapGuides />
              <CanvasMarquee
                items={bounds}
                onSelection={(ids) => onSelectedIdsChange?.(ids)}
              />
              <CanvasSelectionBox
                ids={selectedIds}
                items={bounds}
                onMove={onSelectionMove}
                showHandles={false}
                padding={selectionPadding}
              />
              {showZoomControls ? <CanvasZoomControls position="top-right" /> : null}
              {showMinimap ? <CanvasMinimap position="bottom-right" size={190} /> : null}
              {showStatusBar ? (
                <CanvasStatusBar
                  left={statusLeft ?? <span>{selectedIds.length ? `${selectedIds.length} selected` : "No selection"}</span>}
                  right={statusRight ?? <span>{nodes.length} nodes · {edges.length} edges</span>}
                />
              ) : null}
              {overlay}
            </>
          }
        >
          {edges.map((edge) => {
            const from = nodeMap.get(edge.from);
            const to = nodeMap.get(edge.to);
            if (!from || !to) return null;
            const fromWidth = from.width ?? nodeSize.width;
            const fromHeight = from.height ?? nodeSize.height;
            const toWidth = to.width ?? nodeSize.width;
            const toHeight = to.height ?? nodeSize.height;
            const fromAnchor = resolveGraphPortAnchor(
              from,
              edge.fromPort,
              { width: fromWidth, height: fromHeight },
              "right",
              portSize,
              portGap,
            );
            const toAnchor = resolveGraphPortAnchor(
              to,
              edge.toPort,
              { width: toWidth, height: toHeight },
              "left",
              portSize,
              portGap,
            );
            const selected = selectedEdges.has(edge.id);
            const args = { edge, from, to, selected };
            if (renderEdge) return <Fragment key={edge.id}>{renderEdge(args)}</Fragment>;
            return (
              <CanvasConnection
                key={edge.id}
                from={fromAnchor.point}
                to={toAnchor.point}
                fromDirection={fromAnchor.side}
                toDirection={toAnchor.side}
                curve={edgeCurve}
                arrow
                animated={activeEdges.has(edge.id)}
                color={activeEdges.has(edge.id) ? edgeActiveColor : edgeColor}
                thickness={selected ? 3 : 2}
                endpointPadding={edgeEndpointPadding}
                label={edge.label}
                obstacles={bounds.filter((node) => node.id !== from.id && node.id !== to.id)}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSelectedIdsChange?.([]);
                  onSelectedEdgeIdsChange?.(
                    event.shiftKey
                      ? Array.from(new Set([...selectedEdgeIds, edge.id]))
                      : [edge.id],
                  );
                }}
                onContextMenu={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onSelectedIdsChange?.([]);
                  onSelectedEdgeIdsChange?.([edge.id]);
                  onEdgeContextMenu?.(event, args);
                }}
              />
            );
          })}
          {draftEdge ? (
            <CanvasConnection
              from={draftEdge.fromPoint}
              to={draftEdge.cursor}
              fromDirection={draftEdge.fromSide}
              curve="smart"
              color={edgeActiveColor}
              thickness={2}
              endpointPadding={edgeEndpointPadding}
            />
          ) : null}
          {nodes.map((node) => {
            const selected = selectedSet.has(node.id);
            const width = node.width ?? nodeSize.width;
            const height = node.height ?? nodeSize.height;
            const args = { node, selected };
            return (
              <CanvasItem
                key={node.id}
                id={node.id}
                x={node.x}
                y={node.y}
                draggable={Boolean(onNodeMove)}
                onDrag={(position) => onNodeMove?.(node.id, position)}
                menu={nodeMenu?.(args)}
              >
                <button
                  type="button"
                  onMouseDown={(event) => {
                    if (event.button !== 0 || !onConnect) return;
                    const target = event.target as HTMLElement;
                    const portElement = target.closest<HTMLElement>("[data-graph-port]");
                    const fromPortId = portElement?.dataset.graphPortId;
                    if (!portElement || !fromPortId) return;
                    event.preventDefault();
                    event.stopPropagation();
                    const width = node.width ?? nodeSize.width;
                    const height = node.height ?? nodeSize.height;
                    const fromAnchor = resolveGraphPortAnchor(
                      node,
                      fromPortId,
                      { width, height },
                      "right",
                      portSize,
                      portGap,
                    );
                    const startCursor = screenToWorld(event) ?? fromAnchor.point;
                    setDraftEdge({
                      fromNodeId: node.id,
                      fromPortId,
                      fromPoint: fromAnchor.point,
                      fromSide: fromAnchor.side,
                      cursor: startCursor,
                    });
                    const onMove = (moveEvent: MouseEvent) => {
                      const cursor = screenToWorld(moveEvent);
                      if (cursor) setDraftEdge((current) => current ? { ...current, cursor } : current);
                    };
                    const onUp = (upEvent: MouseEvent) => {
                      window.removeEventListener("mousemove", onMove);
                      window.removeEventListener("mouseup", onUp);
                      const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY) as HTMLElement | null;
                      const dropPortElement = dropTarget?.closest<HTMLElement>("[data-graph-port]");
                      const dropNodeElement = dropTarget?.closest<HTMLElement>("[data-graph-node-id]");
                      const toPortId = dropPortElement?.dataset.graphPortId;
                      const toNodeId = dropNodeElement?.dataset.graphNodeId;
                      const fromNode = nodeMap.get(node.id);
                      const toNode = toNodeId ? nodeMap.get(toNodeId) : undefined;
                      const fromPort = fromNode?.ports?.find((port) => port.id === fromPortId);
                      const toPort = toNode?.ports?.find((port) => port.id === toPortId);
                      if (toNodeId && toPortId && toNodeId !== node.id) {
                        const normalized = normalizeGraphConnection(
                          { nodeId: node.id, portId: fromPortId, side: fromPort?.side ?? "right" },
                          { nodeId: toNodeId, portId: toPortId, side: toPort?.side ?? "left" },
                        );
                        onConnect(normalized);
                      } else {
                        const position = screenToWorld(upEvent);
                        if (position) {
                          onConnectEnd?.({
                            from: node.id,
                            fromPort: fromPortId,
                            fromSide: fromPort?.side ?? "right",
                            position,
                            screenPosition: { x: upEvent.clientX, y: upEvent.clientY },
                          });
                        }
                      }
                      setDraftEdge(null);
                    };
                    window.addEventListener("mousemove", onMove);
                    window.addEventListener("mouseup", onUp);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelectedIdsChange?.(
                      event.shiftKey
                        ? Array.from(new Set([...selectedIds, node.id]))
                        : [node.id],
                    );
                  }}
                  className="block text-left"
                  style={{ width, height }}
                  data-graph-node-id={node.id}
                >
                  {renderNode(args)}
                </button>
              </CanvasItem>
            );
          })}
        </Canvas>
      </div>
    );
  },
);

function resolveGraphPortAnchor(
  node: GraphCanvasNode,
  portId: string | undefined,
  size: { width: number; height: number },
  fallbackSide: GraphPortSide,
  portSize: number,
  portGap: number,
) {
  const ports = node.ports ?? [];
  const port = portId ? ports.find((candidate) => candidate.id === portId) : undefined;
  const side = port?.side ?? fallbackSide;
  const sidePorts = ports.filter((candidate) => (candidate.side ?? "left") === side);
  const index = port ? Math.max(0, sidePorts.findIndex((candidate) => candidate.id === port.id)) : 0;
  const count = Math.max(1, sidePorts.length);
  const offset = (index - (count - 1) / 2) * (portSize + portGap);

  if (side === "left") return { point: { x: node.x, y: node.y + size.height / 2 + offset }, side };
  if (side === "right") return { point: { x: node.x + size.width, y: node.y + size.height / 2 + offset }, side };
  if (side === "top") return { point: { x: node.x + size.width / 2 + offset, y: node.y }, side };
  return { point: { x: node.x + size.width / 2 + offset, y: node.y + size.height }, side };
}

function normalizeGraphConnection(
  source: { nodeId: string; portId: string; side: GraphPortSide },
  target: { nodeId: string; portId: string; side: GraphPortSide },
): GraphCanvasConnectArgs {
  if (source.side === "left" && target.side !== "left") {
    return {
      from: target.nodeId,
      fromPort: target.portId,
      to: source.nodeId,
      toPort: source.portId,
    };
  }
  return {
    from: source.nodeId,
    fromPort: source.portId,
    to: target.nodeId,
    toPort: target.portId,
  };
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}
