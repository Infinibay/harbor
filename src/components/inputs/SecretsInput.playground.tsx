import { SecretsInput } from "./SecretsInput";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: SecretsInput as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    defaultValue: { type: "text", default: "REDACTED_STRIPE_KEY" },
    placeholder: { type: "text", default: "Paste secret" },
    autoReveal: { type: "number", default: 0, min: 0, max: 30, description: "Re-mask after N seconds; 0 = never." },
    copyable: { type: "boolean", default: true },
  },
  variants: [
    { label: "Default", props: {} },
    { label: "Auto-mask · 5s", props: { autoReveal: 5 } },
    { label: "Read only · no copy", props: { copyable: false } },
  ],
};
