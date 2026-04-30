import { FileDrop } from "./FileDrop";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FileDropDemo(props: any) {
  return (
    <div className="w-[480px] max-w-full">
      <FileDrop {...props} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FileDropDemo as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    hint: { type: "text", default: "Drag files or click to browse" },
    accept: { type: "text", default: "" },
    multiple: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Single image", props: { accept: "image/*", multiple: false, hint: "Drop an image" } },
    { label: "Disk images", props: { accept: ".iso,.qcow2", hint: "Drop a disk image" } },
  ],
  events: [{ name: "onFiles", signature: "(files: File[]) => void" }],
};
