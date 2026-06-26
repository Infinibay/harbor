import { createContext, useContext } from "react";

/**
 * Layer stacking context.
 *
 * Harbor's global z-scale (see ./z.ts) deliberately puts content-anchored
 * overlays (POPOVER 1000, SUBMENU 1100, CONTEXT_MENU 2000, HOVER_CARD 2100,
 * TOOLTIP 9000) on tiers that, for DRAWER (4000) and DIALOG (5000), sit ABOVE
 * the page-level popover tiers. That is correct at page level — a dialog must
 * cover a page dropdown — but it means a Select/Menu/Tooltip opened from INSIDE
 * a dialog/drawer would render BEHIND its host, because every overlay portals to
 * document.body and only the z-index decides.
 *
 * LayerContext carries the z-index of the nearest enclosing overlay SURFACE
 * (0 at page level). Surfaces (Dialog, Drawer, Lightbox, CommandPalette) publish
 * their own z via {@link useLayerZ} and wrap their content in a provider; anchored
 * overlays read it via {@link useZIndex} and lift themselves into that surface's
 * reserved 100-value block, preserving their relative order. React context
 * propagates across createPortal, so this works even though every overlay portals
 * to document.body.
 */
export const LayerContext = createContext<number>(0);

/** Read the current layer z-index (0 at page level). */
export function useLayer(): number {
  return useContext(LayerContext);
}

/**
 * The z-index an ANCHORED overlay (Select / Menu / Popover / Tooltip /
 * ContextMenu / HoverCard / …) of global tier `base` should use given the
 * current layer. At page level returns `base` unchanged; inside a surface at
 * z = L it returns `L + round(base / 100)`, which keeps it within L's reserved
 * 100-block and above the surface itself while preserving cross-tier order
 * (inside DIALOG 5000 → POPOVER 5010, SUBMENU 5011, CONTEXT_MENU 5020,
 * HOVER_CARD 5021, TOOLTIP 5090).
 *
 * `base` must be an anchored-overlay tier (≤ TOOLTIP), never a surface tier —
 * surfaces use {@link useLayerZ}.
 */
export function useZIndex(base: number): number {
  const layer = useContext(LayerContext);
  if (layer <= 0) return base;
  return layer + Math.round(base / 100);
}

/**
 * The z-index a SURFACE (Dialog / Drawer / Lightbox / CommandPalette) of global
 * tier `ownTier` should use — and then publish to its subtree via
 * `<LayerContext.Provider value={…}>`. At page level it is `ownTier`; nested
 * inside a deeper surface it sits just above that surface's block, so a modal
 * opened from within a drawer (or another dialog) stacks on top of it instead of
 * behind it.
 */
export function useLayerZ(ownTier: number): number {
  const parent = useContext(LayerContext);
  return parent > 0 ? Math.max(ownTier, parent + 50) : ownTier;
}
