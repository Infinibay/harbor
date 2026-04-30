import { SocialButton } from "./SocialButton";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

export const playground: PlaygroundManifest = {
  component: SocialButton as never,
  importPath: "@infinibay/harbor/buttons",
  controls: {
    provider: {
      type: "select",
      options: ["github", "google", "apple", "microsoft", "x", "gitlab", "discord", "slack"],
      default: "github",
    },
    label: { type: "text", default: "Continue with GitHub" },
    fullWidth: { type: "boolean", default: false },
  },
  variants: [
    { label: "GitHub", props: { provider: "github", label: "Continue with GitHub" } },
    { label: "Google", props: { provider: "google", label: "Continue with Google" } },
    { label: "Apple", props: { provider: "apple", label: "Continue with Apple" } },
    { label: "Discord", props: { provider: "discord", label: "Continue with Discord" } },
  ],
  events: [
    { name: "onClick", signature: "() => void" },
  ],
};
