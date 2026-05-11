# GraphNode

Node primitive for visual workflow builders, topology maps, automation editors, pipelines, and graph-based operations tools.

## Import

```tsx
import {
  ExecutionTrace,
  GraphNode,
  GraphNodePalette,
  GraphPort,
  GraphPortGroup,
} from "@infinibay/harbor/layout";
```

## Basic Usage

```tsx
<GraphNode
  title="Transform"
  subtitle="Normalize event payload"
  status="running"
  selected
  ports={[
    { id: "input", side: "left", label: "Input" },
    { id: "output", side: "right", label: "Output", status: "active" },
  ]}
  meta="2.4k events/min"
/>;
```

## Components

- **GraphNode** - card-like node body with title, subtitle, status, ports, metadata, footer, and actions.
- **GraphPort** - individual connection handle. Use it when composing custom nodes.
- **GraphPortGroup** - positions a group of ports on one side of the node.
- **GraphNodePalette** - searchable palette for adding nodes to a canvas.
- **ExecutionTrace** - compact list for runtime steps, errors, or pipeline progress.

## Props

- **title** - required node label.
- **subtitle** - secondary label for type, path, host, or short description.
- **icon** - visual node category marker.
- **status** - `"idle" | "queued" | "running" | "success" | "warning" | "error" | "disabled"`.
- **selected** - applies selected styling.
- **disabled** - visually mutes the node.
- **ports** - declarative connection handles. Prefer this over custom `inputs` and `outputs` for graph canvases.
- **inputs / outputs** - custom port render slots for specialized nodes.
- **meta** - small supporting data under the heading.
- **footer** - bottom area for counters, configuration, or trace snippets.
- **actions** - compact node-level actions.

## Port Model

Ports have an `id`, optional label, side, color, status, and disabled state. `GraphCanvas` uses port ids to resolve edge anchors, so keep ids stable across renders.

Use side names from the node's perspective: `left` for incoming data, `right` for outgoing data, `top` for control inputs, and `bottom` for diagnostics or secondary output when the graph needs more than one axis.

## Accessibility

`GraphNode` is visual, so place it inside an interactive parent such as `GraphCanvas` or a button when it needs selection behavior. Labels and status should also be represented in a side panel or inspector for keyboard-heavy workflows.

## Gotchas

Do not encode business state only through port color. Pair status colors with labels, badges, traces, or inspector text.

## Related Components

`GraphCanvas`, `Canvas`, `CanvasConnection`, `CanvasToolbar`, `CanvasMinimap`, `Inspector`.
