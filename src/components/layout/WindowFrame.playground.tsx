import { WindowFrame } from "./WindowFrame";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WindowFrameDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <WindowFrame
        {...props}
        title={props.title ?? "harbor — showcase"}
        subtitle={props.subtitle ?? "localhost:3000"}
        toolbar={
          props.showToolbar ? (
            <div className="flex items-center gap-2 text-xs text-white/60">
              <button className="px-2 py-1 rounded-md hover:bg-white/5">File</button>
              <button className="px-2 py-1 rounded-md hover:bg-white/5">Edit</button>
              <button className="px-2 py-1 rounded-md hover:bg-white/5">View</button>
            </div>
          ) : null
        }
        statusBar={
          props.showStatusBar ? (
            <div className="flex items-center justify-between text-[11px] text-white/45">
              <span>Ready</span>
              <span>Ln 42 · Col 8</span>
            </div>
          ) : null
        }
      >
        <div className="h-72">
          <img
            src="/picture.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </WindowFrame>
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: WindowFrameDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    chromeStyle: {
      type: "select",
      options: ["macos", "windows"],
      default: "macos",
    },
    title: { type: "text", default: "harbor — showcase" },
    subtitle: { type: "text", default: "localhost:3000" },
    showToolbar: { type: "boolean", default: true },
    showStatusBar: { type: "boolean", default: true },
  },
  variants: [
    { label: "macOS chrome", props: { chromeStyle: "macos" } },
    { label: "Windows chrome", props: { chromeStyle: "windows" } },
    { label: "Minimal (no toolbar/status)", props: { showToolbar: false, showStatusBar: false } },
  ],
  events: [
    { name: "onClose" },
    { name: "onMinimize" },
    { name: "onMaximize" },
  ],
};
