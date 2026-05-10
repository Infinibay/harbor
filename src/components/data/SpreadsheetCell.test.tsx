import { describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SpreadsheetCell } from "./SpreadsheetCell";

describe("SpreadsheetCell", () => {
  it("selects on first click and requests edit on second click", () => {
    const onSelect = vi.fn();
    const onEditStart = vi.fn();
    const { rerender } = renderWithHarbor(
      <SpreadsheetCell id="A1" value="Revenue" onSelect={onSelect} onEditStart={onEditStart} />,
    );
    fireEvent.mouseDown(document.querySelector("input")!);
    expect(onSelect).toHaveBeenCalledWith("A1", { extend: false, edit: false });

    rerender(
      <SpreadsheetCell id="A1" value="Revenue" selected rangeSize={1} onSelect={onSelect} onEditStart={onEditStart} />,
    );
    fireEvent.mouseDown(document.querySelector("input")!);
    expect(onSelect).toHaveBeenLastCalledWith("A1", { extend: false, edit: true });
    expect(onEditStart).toHaveBeenCalledWith("A1");
  });

  it("reports keyboard value replacement in select mode", () => {
    const onValueChange = vi.fn();
    const onEditStart = vi.fn();
    renderWithHarbor(
      <SpreadsheetCell id="B2" value="10" selected onValueChange={onValueChange} onEditStart={onEditStart} />,
    );
    fireEvent.keyDown(document.querySelector("input")!, { key: "4" });
    expect(onEditStart).toHaveBeenCalledWith("B2");
    expect(onValueChange).toHaveBeenCalledWith("B2", "4");
  });

  it("does not collapse shift range selection when the input receives focus", () => {
    const onSelect = vi.fn();
    renderWithHarbor(<SpreadsheetCell id="C3" value="42" onSelect={onSelect} />);
    const cell = document.querySelector("input")!;

    fireEvent.mouseDown(cell, { shiftKey: true });
    fireEvent.focus(cell);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("C3", { extend: true, edit: false });
  });

  it("does not reselect when focusing a cell already inside a range", () => {
    const onSelect = vi.fn();
    renderWithHarbor(<SpreadsheetCell id="D4" value="42" inSelection onSelect={onSelect} />);

    fireEvent.focus(document.querySelector("input")!);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("starts range dragging without focus collapsing the active range", () => {
    const onSelect = vi.fn();
    const onRangeDragStart = vi.fn();
    renderWithHarbor(
      <SpreadsheetCell
        id="B2"
        value="10"
        selected
        rangeSize={2}
        onSelect={onSelect}
        onRangeDragStart={onRangeDragStart}
      />,
    );
    const cell = document.querySelector("input")!;

    fireEvent.mouseDown(cell);
    fireEvent.focus(cell);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("B2", { extend: false, edit: false });
    expect(onRangeDragStart).toHaveBeenCalledWith("B2", false);
  });

  it("converts cell style to CSS for fonts, color, fill, and borders", () => {
    renderWithHarbor(
      <SpreadsheetCell
        id="A1"
        value="Revenue"
        style={{
          fontSize: 14,
          fontFamily: "mono",
          color: "accent",
          backgroundColor: "success",
          bold: true,
          italic: true,
          underline: true,
          borders: {
            top: { color: "danger", style: "dotted", width: 2 },
          },
        }}
      />,
    );
    const cell = document.querySelector("input")!;
    expect(cell.style.fontSize).toBe("14px");
    expect(cell.style.fontWeight).toBe("700");
    expect(cell.style.fontStyle).toBe("italic");
    expect(cell.style.textDecoration).toBe("underline");
    expect(cell.style.borderTop).toContain("2px dotted");
  });

  it("preserves string font sizes without appending pixels", () => {
    renderWithHarbor(<SpreadsheetCell id="A1" value="Revenue" style={{ fontSize: "1rem" }} />);
    expect(document.querySelector("input")!.style.fontSize).toBe("1rem");
  });
});
