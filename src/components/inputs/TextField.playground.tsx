import { TextField } from "./TextField";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: TextField as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    label: { type: "text", default: "Email" },
    placeholder: { type: "text", default: "you@company.com" },
    hint: { type: "text", default: "We'll send a verification link." },
    error: { type: "text", default: "" },
    valid: { type: "boolean", default: false, description: "Shows the success affordance." },
    disabled: { type: "boolean", default: false },
  },
  variants: [
    { label: "Default", props: { label: "Email" } },
    { label: "With error", props: { label: "Email", error: "Email is already in use", hint: "" } },
    { label: "Valid", props: { label: "Email", valid: true, hint: "Looks good." } },
    { label: "Disabled", props: { disabled: true } },
  ],
  events: [
    { name: "onChange", signature: "(e: ChangeEvent<HTMLInputElement>) => void" },
    { name: "onFocus", signature: "(e: FocusEvent<HTMLInputElement>) => void" },
    { name: "onBlur", signature: "(e: FocusEvent<HTMLInputElement>) => void" },
  ],
};
