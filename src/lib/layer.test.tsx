import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../test/renderWithHarbor";
import { Dialog, DialogBody } from "../components/overlays/Dialog";
import { Z } from "./z";
import { LayerContext, useZIndex, useLayer, useLayerZ } from "./layer";

/* Tiny probes that surface a hook value as text. */
function ProbeZ({ base, id }: { base: number; id: string }) {
  return <span data-testid={id}>{useZIndex(base)}</span>;
}
function ProbeLayerZ({ tier, id }: { tier: number; id: string }) {
  return <span data-testid={id}>{useLayerZ(tier)}</span>;
}
function ProbeLayer({ id }: { id: string }) {
  return <span data-testid={id}>{useLayer()}</span>;
}
const num = (id: string) => Number(screen.getByTestId(id).textContent);

describe("layer — z-index lifting inside surfaces", () => {
  it("anchored overlay keeps its global tier at page level", () => {
    renderWithHarbor(<ProbeZ base={Z.POPOVER} id="p" />);
    expect(num("p")).toBe(Z.POPOVER); // 1000, unchanged
  });

  it("anchored overlays lift into the enclosing surface's reserved block, ordered", () => {
    renderWithHarbor(
      <LayerContext.Provider value={Z.DIALOG}>
        <ProbeZ base={Z.POPOVER} id="pop" />
        <ProbeZ base={Z.SUBMENU} id="sub" />
        <ProbeZ base={Z.CONTEXT_MENU} id="ctx" />
        <ProbeZ base={Z.TOOLTIP} id="tip" />
      </LayerContext.Provider>,
    );
    // inside DIALOG(5000): POPOVER→5010, SUBMENU→5011, CONTEXT_MENU→5020, TOOLTIP→5090
    expect(num("pop")).toBe(Z.DIALOG + 10);
    expect(num("sub")).toBe(Z.DIALOG + 11);
    expect(num("ctx")).toBe(Z.DIALOG + 20);
    expect(num("tip")).toBe(Z.DIALOG + 90);
    // every one sits ABOVE the dialog but within its reserved 100-block, order preserved
    for (const id of ["pop", "sub", "ctx", "tip"]) {
      expect(num(id)).toBeGreaterThan(Z.DIALOG);
      expect(num(id)).toBeLessThan(Z.DIALOG + 100);
    }
    expect(num("pop")).toBeLessThan(num("sub"));
    expect(num("sub")).toBeLessThan(num("ctx"));
    expect(num("ctx")).toBeLessThan(num("tip"));
  });

  it("a surface sits at its own tier at page level", () => {
    renderWithHarbor(<ProbeLayerZ tier={Z.DIALOG} id="d" />);
    expect(num("d")).toBe(Z.DIALOG); // 5000
  });

  it("a dialog over a drawer keeps its own (higher) tier", () => {
    renderWithHarbor(
      <LayerContext.Provider value={Z.DRAWER}>
        <ProbeLayerZ tier={Z.DIALOG} id="d" />
      </LayerContext.Provider>,
    );
    expect(num("d")).toBe(Z.DIALOG); // max(5000, 4000+50) = 5000
  });

  it("a dialog nested in another dialog lifts just above its host", () => {
    renderWithHarbor(
      <LayerContext.Provider value={Z.DIALOG}>
        <ProbeLayerZ tier={Z.DIALOG} id="d" />
      </LayerContext.Provider>,
    );
    expect(num("d")).toBe(Z.DIALOG + 50); // 5050, above the host dialog
  });

  it("Dialog publishes its layer to its portalled children (so a Select inside lifts above it)", () => {
    renderWithHarbor(
      <Dialog open onClose={() => {}}>
        <DialogBody>
          <ProbeLayer id="inside" />
        </DialogBody>
      </Dialog>,
    );
    // children see the dialog's z, so useZIndex(Z.POPOVER) there resolves to 5010 > 5000
    expect(num("inside")).toBe(Z.DIALOG);
  });
});
