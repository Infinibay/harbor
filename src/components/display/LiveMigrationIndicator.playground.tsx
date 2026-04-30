import { useEffect, useState } from "react";
import { LiveMigrationIndicator } from "./LiveMigrationIndicator";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function LiveMigrationIndicatorDemo(props: any) {
  const [progress, setProgress] = useState(props.progress ?? 0.62);

  useEffect(() => {
    if (!props.animated) return;
    const id = window.setInterval(() => {
      setProgress((p: number) => (p >= 1 ? 0 : Math.min(1, p + 0.02)));
    }, 120);
    return () => window.clearInterval(id);
  }, [props.animated]);

  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      <LiveMigrationIndicator
        {...props}
        progress={props.animated ? progress : (props.progress ?? 0.62)}
        etaMs={props.animated ? Math.max(0, (1 - progress) * 60_000) : props.etaMs}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: LiveMigrationIndicatorDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    sourceHost: { type: "text", default: "vm-prod-01" },
    destHost: { type: "text", default: "vm-prod-02" },
    progress: { type: "number", default: 0.62, min: 0, max: 1, step: 0.01 },
    etaMs: { type: "number", default: 45_000, min: 0, max: 600_000, step: 1000 },
    detail: { type: "text", default: "memory copying… 1.2 GiB / 2.0 GiB" },
    color: { type: "text", default: "rgb(168 85 247)" },
    animated: { type: "boolean", default: false, description: "Auto-advance progress in the demo." },
  },
};
