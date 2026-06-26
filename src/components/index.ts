/**
 * Harbor — public API surface.
 *
 * Import from the root for a flat component API:
 *   import { Button, Dialog, DataTable } from "@harbor/ui";
 *
 * Or target a specific category if you want finer control and better
 * tree-shaking in some bundlers:
 *   import { Button } from "@harbor/ui/buttons";
 */

export * from "./buttons";
export * from "./inputs";
export * from "./display";
export * from "./data";
export * from "./charts";
export * from "./feedback";
export * from "./overlays";
export * from "./navigation";
export * from "./layout";
export * from "./chat";
export * from "./collab";
export * from "./media";
export * from "./dev";
export * from "./sections";
export * from "./backgrounds";
export * from "./motion";

// Layer system — the authoritative z-index scale and the nested-overlay helpers.
// Exported so app code stacks against the SAME scale instead of hardcoding values.
export { Z } from "../lib/z";
export type { ZKey } from "../lib/z";
export { LayerContext, useLayer, useZIndex, useLayerZ } from "../lib/layer";
