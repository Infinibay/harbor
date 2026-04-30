import { CommitCard } from "./CommitCard";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CommitCardDemo(props: any) {
  return (
    <div style={{ width: "100%", maxWidth: 640 }}>
      <CommitCard
        {...props}
        onClick={() => props.onClick?.()}
      />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: CommitCardDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    sha: { type: "text", default: "aB3f7Q1c0d4e9f2a8b5" },
    authorName: { type: "text", default: "Ana Pérez" },
    authorEmail: { type: "text", default: "ana@infinibay.io" },
    message: {
      type: "text",
      default: "Fix race in token rotation\n\nReplaces the global lock with a per-key mutex.",
    },
    at: { type: "number", default: Date.now() - 2 * 3600_000, description: "Unix ms timestamp." },
  },
  events: [{ name: "onClick", signature: "() => void" }],
  variants: [
    {
      label: "With stats + refs",
      props: {
        // these are passed through props spread
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stats: { additions: 42, deletions: 11, files: 3 } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refs: ["main", "v0.4.2"] as any,
      },
    },
  ],
};
