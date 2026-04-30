import { Skeleton } from "./Skeleton";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SkeletonDemo(props: any) {
  return (
    <div className="w-80 space-y-3">
      <Skeleton {...props} />
      <Skeleton {...props} width={props.width ?? "70%"} />
      <Skeleton {...props} width={props.width ?? "85%"} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: SkeletonDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {
    width: { type: "text", default: "100%" },
    height: { type: "text", default: "12px" },
    circle: { type: "boolean", default: false },
  },
  variants: [
    { label: "Lines", props: { circle: false, height: "12px" } },
    { label: "Title block", props: { height: "24px" } },
    { label: "Avatar", props: { circle: true, width: "48px", height: "48px" } },
  ],
};
