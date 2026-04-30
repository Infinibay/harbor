import { useState } from "react";
import { FindBar } from "./FindBar";
import { Button } from "../buttons/Button";
import type { PlaygroundManifest } from "../../../../harbor-site/src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FindBarDemo(props: any) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open find bar</Button>
      <FindBar
        {...props}
        open={open}
        onClose={() => {
          setOpen(false);
          props.onClose?.();
        }}
        total={42}
        current={7}
      />
    </>
  );
}

export const playground: PlaygroundManifest = {
  component: FindBarDemo as never,
  importPath: "@infinibay/harbor/dev",
  controls: {
    showReplace: { type: "boolean", default: false },
    caseSensitive: { type: "boolean", default: false },
    regex: { type: "boolean", default: false },
  },
  events: [
    { name: "onChange", signature: "(q: string) => void" },
    { name: "onNext", signature: "() => void" },
    { name: "onPrev", signature: "() => void" },
    { name: "onReplace", signature: "(find: string, replace: string) => void" },
  ],
};
