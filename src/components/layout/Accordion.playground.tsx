import { Accordion, AccordionItem } from "./Accordion";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AccordionDemo(props: any) {
  return (
    <Accordion {...props}>
      <AccordionItem value="general" title="General">
        Workspace name, locale, and default theme settings.
      </AccordionItem>
      <AccordionItem value="billing" title="Billing">
        Current plan, invoices, and payment method.
      </AccordionItem>
      <AccordionItem value="danger" title="Danger zone">
        Permanently delete this workspace.
      </AccordionItem>
    </Accordion>
  );
}

export const playground: PlaygroundManifest = {
  component: AccordionDemo as never,
  importPath: "@infinibay/harbor/layout",
  controls: {
    multiple: { type: "boolean", default: false, description: "Allow several panels open at once." },
    defaultValue: { type: "text", default: "general", description: "Initially open item value." },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Multiple open", props: { multiple: true, defaultValue: "general" } },
    { label: "All collapsed", props: { defaultValue: "" } },
  ],
  events: [],
  notes: "Compose with <AccordionItem value title icon> children. State is uncontrolled.",
};
