import { Tabs, TabList, Tab, TabPanel } from "./Tabs";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TabsDemo(props: any) {
  return (
    <Tabs {...props}>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="activity">Activity</Tab>
        <Tab value="settings">Settings</Tab>
      </TabList>
      <TabPanel value="overview">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
          Overview content. Charts and KPIs go here.
        </div>
      </TabPanel>
      <TabPanel value="activity">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
          Activity feed.
        </div>
      </TabPanel>
      <TabPanel value="settings">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
          Settings form.
        </div>
      </TabPanel>
    </Tabs>
  );
}

export const playground: PlaygroundManifest = {
  component: TabsDemo as never,
  importPath: "@infinibay/harbor/navigation",
  controls: {
    variant: { type: "select", options: ["pill", "underline", "card"], default: "pill" },
    defaultValue: { type: "select", options: ["overview", "activity", "settings"], default: "overview" },
  },
  variants: [
    { label: "Pill", props: { variant: "pill" } },
    { label: "Underline", props: { variant: "underline" } },
    { label: "Card", props: { variant: "card" } },
  ],
  events: [
    { name: "onValueChange", signature: "(v: string) => void" },
  ],
};
