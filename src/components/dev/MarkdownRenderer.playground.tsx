import { MarkdownRenderer } from "./MarkdownRenderer";
import type { PlaygroundManifest } from "../../../src/harbor/lib/playground";

const sample = `# Markdown demo

This is **bold**, *italic*, and \`inline code\`.

- One bullet
- Another bullet
  - Nested
- And a [link](https://infinibay.com)

\`\`\`tsx
const x = 1;
\`\`\`

> Block quote — for important asides.
`;

export const playground: PlaygroundManifest = {
  component: MarkdownRenderer as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    source: { type: "text", default: sample },
  },
};
