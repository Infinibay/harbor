import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ActionRow } from "./ActionRow";

/** Drill from a known child up to the ActionRow wrapper. */
function getRow(childLabel: string): HTMLElement {
  return screen.getByRole("button", { name: childLabel }).parentElement!;
}

describe("ActionRow", () => {
  it("renders its children as buttons", () => {
    renderWithHarbor(
      <ActionRow>
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </ActionRow>,
    );
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("applies the `end` justify class by default", () => {
    renderWithHarbor(
      <ActionRow>
        <button type="button">Save</button>
      </ActionRow>,
    );
    expect(getRow("Save").className).toMatch(/justify-end/);
  });

  it("supports `between`, `start`, `center`", () => {
    const cases = ["start", "center", "between"] as const;
    for (const align of cases) {
      const { unmount } = renderWithHarbor(
        <ActionRow align={align}>
          <button type="button">A</button>
          <button type="button">B</button>
        </ActionRow>,
      );
      expect(getRow("A").className).toMatch(new RegExp(`justify-${align}`));
      unmount();
    }
  });

  it("adds the divider class when `divide` is set", () => {
    renderWithHarbor(
      <ActionRow divide>
        <button type="button">Save</button>
      </ActionRow>,
    );
    expect(getRow("Save").className).toMatch(/border-t/);
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ActionRow>
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </ActionRow>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
