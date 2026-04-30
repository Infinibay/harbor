import { useState } from "react";
import { APIKeyCard } from "./APIKeyCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

const HOUR = 1000 * 60 * 60;
const REAL_FINGERPRINT = "prod_aB3f7Q1c0d4e9f2a8b5";

function mask(s: string) {
  if (s.length <= 8) return "•".repeat(s.length);
  return s.slice(0, 5) + "…" + "•".repeat(Math.max(3, s.length - 8));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function APIKeyCardDemo(props: any) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ width: "100%", maxWidth: 540 }}>
      <APIKeyCard
        {...props}
        revealed={revealed}
        fingerprint={revealed ? REAL_FINGERPRINT : mask(REAL_FINGERPRINT)}
        onReveal={() => {
          setRevealed((v) => !v);
          props.onReveal?.();
        }}
        onCopy={() => props.onCopy?.()}
        onRotate={() => props.onRotate?.()}
        onRevoke={() => props.onRevoke?.()}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: APIKeyCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    label: { type: "text", default: "Deploy bot" },
    scope: { type: "text", default: "read:events, write:deploys" },
    privileged: { type: "boolean", default: false },
    createdAt: { type: "text", default: "2026-02-12" },
    lastUsed: { type: "number", default: Date.now() - HOUR / 2, description: "Unix ms timestamp." },
  },
  variants: [
    { label: "Standard", props: { privileged: false } },
    { label: "Privileged", props: { privileged: true } },
  ],
  events: [
    { name: "onReveal", signature: "() => void", description: "Demo toggles a local masked/unmasked state — in real apps you'd open a modal that fetches the decrypted secret." },
    { name: "onCopy", signature: "() => void" },
    { name: "onRotate", signature: "() => void" },
    { name: "onRevoke", signature: "() => void" },
  ],
  notes:
    "The component itself has no masking logic — fingerprint is rendered as passed. This demo wires `onReveal` to a local `useState` so you can see the intended pattern.",
};
