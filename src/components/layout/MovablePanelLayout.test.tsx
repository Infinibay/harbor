import { describe, expect, it, vi } from "vitest";
import { act, fireEvent } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { MovablePanelLayout, type MovablePanel } from "./MovablePanelLayout";

const panel: MovablePanel = {
  id: "inspector",
  title: "Inspector",
  position: "right",
  content: <div>Panel content</div>,
};

function renderDock(onPanelMove = vi.fn()) {
  const result = renderWithHarbor(
    <MovablePanelLayout panels={[panel]} leftSize={260} rightSize={300} bottomSize={220} onPanelMove={onPanelMove}>
      <div>Editor</div>
    </MovablePanelLayout>,
  );
  const root = result.container.querySelector(".relative.grid.h-full") as HTMLElement;
  root.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    right: 1000,
    bottom: 700,
    width: 1000,
    height: 700,
    toJSON: () => ({}),
  });
  return { ...result, onPanelMove };
}

describe("MovablePanelLayout", () => {
  it("moves a panel to the hovered dock zone after pointer drag", async () => {
    const { container, onPanelMove } = renderDock();
    const header = container.querySelector("section > div") as HTMLElement;

    fireEvent.pointerDown(header, { button: 0, clientX: 900, clientY: 20, pointerId: 1 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    act(() => {
    window.dispatchEvent(new PointerEvent("pointermove", { clientX: 70, clientY: 120, pointerId: 1 }));
    window.dispatchEvent(new PointerEvent("pointerup", { clientX: 70, clientY: 120, pointerId: 1 }));
    });

    expect(onPanelMove).toHaveBeenCalledWith("inspector", "left");
  });

  it("does not move a panel on a simple click", () => {
    const { container, onPanelMove } = renderDock();
    const header = container.querySelector("section > div") as HTMLElement;

    fireEvent.pointerDown(header, { button: 0, clientX: 900, clientY: 20, pointerId: 1 });
    act(() => {
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: 901, clientY: 21, pointerId: 1 }));
    });

    expect(onPanelMove).not.toHaveBeenCalled();
  });
});
