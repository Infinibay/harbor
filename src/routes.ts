export type RouteEntry = {
  path: string;
  label: string;
  kicker?: string;
};

export type RouteGroup = {
  id: string;
  label: string;
  routes: RouteEntry[];
};

export const routeGroups: RouteGroup[] = [
  {
    id: "foundations",
    label: "Foundations",
    routes: [
      { path: "/foundations/buttons", label: "Buttons" },
      { path: "/foundations/inputs", label: "Inputs & Forms" },
      { path: "/foundations/display", label: "Display" },
      { path: "/foundations/data", label: "Data" },
      { path: "/foundations/feedback", label: "Feedback" },
      { path: "/foundations/overlays", label: "Overlays" },
      { path: "/foundations/navigation", label: "Navigation" },
      { path: "/foundations/containers", label: "Containers" },
      { path: "/foundations/sections", label: "Sections · reading" },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    routes: [
      { path: "/patterns/coordination", label: "Coordination" },
    ],
  },
  {
    id: "apps",
    label: "Applications",
    routes: [
      { path: "/apps/ide", label: "IDE · editor" },
      { path: "/apps/design", label: "Design tool" },
      { path: "/apps/music", label: "Music player" },
      { path: "/apps/media", label: "Media · video" },
      { path: "/apps/desktop", label: "Desktop chrome" },
      { path: "/apps/dev", label: "Dev · terminals" },
      { path: "/apps/chat", label: "Chat · social" },
      { path: "/apps/collab", label: "Collab · comments" },
      { path: "/apps/dashboard", label: "Dashboard" },
      { path: "/apps/files", label: "File manager" },
      { path: "/apps/email", label: "Email client" },
      { path: "/apps/kanban", label: "Kanban · workflow" },
    ],
  },
];

export const flatRoutes = routeGroups.flatMap((g) =>
  g.routes.map((r) => ({ ...r, group: g.id })),
);
