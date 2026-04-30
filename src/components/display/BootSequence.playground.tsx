import { BootSequence, type BootStage } from "./BootSequence";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const stages: BootStage[] = [
  { id: "bios", label: "BIOS POST", status: "done", duration: 412 },
  { id: "kernel", label: "Kernel handoff", status: "done", duration: 1_204 },
  { id: "initrd", label: "initrd", status: "running", detail: "Mounting /home" },
  { id: "systemd", label: "systemd targets", status: "pending" },
  { id: "ssh", label: "OpenSSH", status: "pending" },
];

const failedStages: BootStage[] = [
  { id: "bios", label: "BIOS POST", status: "done", duration: 412 },
  { id: "kernel", label: "Kernel handoff", status: "done", duration: 1_204 },
  { id: "initrd", label: "initrd", status: "failed", duration: 84, detail: "panic: VFS unable to mount root fs" },
  { id: "systemd", label: "systemd targets", status: "skipped" },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BootSequenceDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <BootSequence stages={props.failed ? failedStages : stages} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: BootSequenceDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    failed: { type: "boolean", default: false, description: "Toggle the failed-boot variant." },
  },
  variants: [
    { label: "In progress", props: { failed: false } },
    { label: "Failed", props: { failed: true } },
  ],
};
