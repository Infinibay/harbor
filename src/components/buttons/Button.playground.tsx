import { Button } from "./Button";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

/**
 * Playground manifest for <Button>. Only the props that make sense to
 * tweak interactively are exposed — the cursor-proximity flags
 * (`reactive`, `magnetic`) are surfaced because they're the most "alive"
 * thing about Harbor and worth letting visitors poke at.
 */
export const playground: PlaygroundManifest = {
  component: Button as never,
  importPath: "@infinibay/harbor/buttons",
  defaultChildren: "Save changes",
  controls: {
    variant: {
      type: "select",
      options: ["primary", "secondary", "ghost", "destructive", "glass", "link"],
      default: "primary",
    },
    size: {
      type: "select",
      options: ["sm", "md", "lg"],
      default: "md",
    },
    align: {
      type: "select",
      options: ["start", "center", "end"],
      default: "center",
    },
    loading: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    reactive: {
      type: "boolean",
      default: true,
      description: "Subtle cursor-proximity lean and inner glow.",
    },
    magnetic: {
      type: "boolean",
      default: false,
      description: "Stronger cursor pull; gives the button a magnetic feel.",
    },
    ripple: {
      type: "boolean",
      default: true,
      description: "Material-style click ripple from the cursor position.",
    },
    fullWidth: { type: "boolean", default: false },
  },
  variants: [
    { label: "Primary", props: { variant: "primary" } },
    { label: "Secondary", props: { variant: "secondary" } },
    { label: "Ghost", props: { variant: "ghost" } },
    { label: "Destructive", props: { variant: "destructive" } },
    { label: "Glass", props: { variant: "glass" } },
    { label: "Link", props: { variant: "link" } },
    {
      label: "Loading",
      props: { variant: "primary", loading: true },
      description: "Shows the spinner state.",
    },
    {
      label: "Magnetic",
      props: { variant: "primary", magnetic: true },
      description: "Move the cursor near the button to feel the pull.",
    },
  ],
  events: [
    { name: "onClick", signature: "(e: MouseEvent) => void", description: "Fires on press." },
    { name: "onFocus", signature: "(e: FocusEvent) => void" },
    { name: "onBlur", signature: "(e: FocusEvent) => void" },
  ],
  notes:
    "Move the cursor near the button — most variants react. Toggle `reactive` off to compare.",
};
