import { AppHeader } from "./AppHeader";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AppHeaderDemo(props: any) {
  return (
    <AppHeader
      {...props}
      left={<span className="font-semibold">Project / Settings</span>}
      right={
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>v0.4.2</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
      }
    />
  );
}

export const playground: PlaygroundManifest = {
  component: AppHeaderDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    sticky: { type: "boolean", default: false, description: "Stick to viewport top." },
  },
};
