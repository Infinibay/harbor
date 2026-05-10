# MovablePanelLayout

Desktop-style layout primitive for IDEs and Tauri/Electron applications.
Panels can be moved between left, right, bottom, or hidden zones, similar to
VS Code side bars and auxiliary panels.

## Import

```tsx
import {
  MovablePanelLayout,
  type MovablePanel,
  type MovablePanelPosition,
} from "@infinibay/harbor/layout";
```

## Example

```tsx
const [positions, setPositions] = useState({
  explorer: "left",
  assistant: "right",
  terminal: "bottom",
});

<MovablePanelLayout
  panels={[
    { id: "explorer", title: "Explorer", position: positions.explorer, content: <Explorer /> },
    { id: "assistant", title: "Assistant", position: positions.assistant, content: <Assistant /> },
    { id: "terminal", title: "Terminal", position: positions.terminal, content: <Terminal /> },
  ]}
  onPanelMove={(id, position) =>
    setPositions((current) => ({ ...current, [id]: position }))
  }
>
  <Editor />
</MovablePanelLayout>
```
