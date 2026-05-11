# GraphCanvas

Complete graph workspace for node editors, workflow builders, topology diagrams, automation canvases, and visual programming surfaces.

`GraphCanvas` builds on the lower-level canvas primitives and adds graph-specific behavior: draggable nodes, selectable edges, marquee selection, minimap, zoom controls, status bar, edge routing, port-aware connections, node context menus, and optional custom edge rendering.

## Import

```tsx
import { GraphCanvas, GraphNode } from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<GraphCanvas
  nodes={nodes}
  edges={edges}
  selectedIds={selectedIds}
  onSelectedIdsChange={setSelectedIds}
  onNodeMove={(nodeId, position) => moveNode(nodeId, position)}
  onConnect={(connection) => addEdge(connection)}
  renderNode={({ node, selected }) => (
    <GraphNode
      title={node.data.label}
      subtitle={node.data.kind}
      selected={selected}
      ports={node.ports}
    />
  )}
/>;
```

## Data Model

Nodes need stable `id`, `x`, and `y` values. Optional `width`, `height`, `ports`, and `data` let you adapt the component to your domain without forking the canvas.

Edges need stable `id`, `from`, and `to` node ids. Use `fromPort` and `toPort` when nodes expose multiple ports. Edge `data` is available to custom renderers.

## Props

- **nodes / edges** - controlled graph model.
- **selectedIds** - selected node ids.
- **selectedEdgeIds** - selected edge ids.
- **activeEdgeIds** - edges rendered as active or animated.
- **onSelectedIdsChange / onSelectedEdgeIdsChange** - selection callbacks.
- **onNodeMove** - enables node dragging and reports new world coordinates.
- **onSelectionMove** - moves a multi-selection box.
- **onConnect** - fires when the user drags from one port to another valid port.
- **onConnectEnd** - fires when a connection drag ends on empty canvas.
- **renderNode** - required renderer for node bodies.
- **renderEdge** - optional custom edge renderer.
- **nodeMenu / canvasMenu / onEdgeContextMenu** - context menu slots for graph actions.
- **showMinimap / showZoomControls / showStatusBar** - built-in workspace chrome toggles.

## Interaction Model

Use `onNodeMove` to persist positions. Use `onSelectedIdsChange` and `onSelectedEdgeIdsChange` to drive inspectors, toolbars, and keyboard shortcuts. Use `onConnect` to update the edge list after a successful port-to-port drag.

`GraphCanvas` normalizes connections that start from a left-side port so the resulting edge still flows from output to input when possible.

## Composition Notes

Pair `GraphCanvas` with `GraphNode`, `CanvasToolbar`, `GraphNodePalette`, `Inspector`, `StatusBar`, and `CommandPalette`. Keep the graph itself focused on spatial editing; put complex configuration in a side panel or drawer.

## Accessibility

Graph editors are inherently spatial. Provide alternate selection and editing paths through an inspector, command palette, keyboard shortcuts, and a list representation for important graph objects.

## Gotchas

Keep node dimensions stable. If node content changes height after render, edge anchors and selection boxes can feel inaccurate. Prefer fixed node widths and compact metadata.

Do not mutate `nodes` or `edges` in place. Controlled graph state should produce new arrays so React and memoized maps update correctly.

## Related Components

`GraphNode`, `Canvas`, `CanvasConnection`, `CanvasToolbar`, `CanvasMinimap`, `CanvasSelectionBox`, `CanvasStatusBar`, `Inspector`.
