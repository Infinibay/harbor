import { EventCard } from "./EventCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EventCardDemo(props: any) {
  return <EventCard {...props} date={new Date(Date.now() + 1000 * 60 * 60 * 26)} />;
}

export const playground: PlaygroundManifest = {
  component: EventCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    title: { type: "text", default: "Harbor v0.5 launch" },
    time: { type: "text", default: "10:00 AM" },
    location: { type: "text", default: "Online · Zoom" },
    description: { type: "text", default: "Live demo + Q&A on the new component playground." },
    attendees: { type: "number", default: 128, min: 0 },
    attending: { type: "boolean", default: false },
  },
  events: [{ name: "onToggleAttending", signature: "() => void" }],
};
