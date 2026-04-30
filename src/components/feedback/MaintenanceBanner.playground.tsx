import { MaintenanceBanner } from "./MaintenanceBanner";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MaintenanceBannerDemo(props: any) {
  const offsetMs = (props.offsetMinutes ?? 30) * 60 * 1000;
  return (
    <MaintenanceBanner
      {...props}
      scheduledAt={new Date(Date.now() + offsetMs)}
      duration={(props.durationMinutes ?? 30) * 60 * 1000}
    />
  );
}

export const playground: PlaygroundManifest = {
  component: MaintenanceBannerDemo as never,
  importPath: "@infinibay/harbor/feedback",
  controls: {
    offsetMinutes: { type: "number", default: 30, min: -60, max: 1440, step: 15, description: "Minutes from now until maintenance starts. Negative = ongoing." },
    durationMinutes: { type: "number", default: 30, min: 5, max: 720, step: 5 },
    scope: { type: "text", default: "API · file uploads" },
    forceSticky: { type: "boolean", default: false },
  },
  variants: [
    { label: "Upcoming", props: { offsetMinutes: 30, scope: "API · file uploads" } },
    { label: "Ongoing", props: { offsetMinutes: -10, scope: "Database · failover" } },
    { label: "Sticky", props: { offsetMinutes: 30, forceSticky: true } },
  ],
  events: [{ name: "onClose", signature: "() => void" }],
};
