import { PasswordStrength } from "./PasswordStrength";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: PasswordStrength as never,
  importPath: "@infinibay/harbor/inputs",
  controls: {
    value: { type: "text", default: "Password123!" },
    showLabel: { type: "boolean", default: true },
  },
  variants: [
    { label: "Weak", props: { value: "abc" } },
    { label: "OK", props: { value: "horsebatterystaple" } },
    { label: "Strong", props: { value: "tR0ub4dor!&horse" } },
    { label: "Bars only", props: { value: "Password123!", showLabel: false } },
  ],
};
