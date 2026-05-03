import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    renderWithHarbor(<EmptyState title="No items" />);
    expect(document.querySelector(".text-white")?.textContent).toContain("No items");
  });

  it("renders description", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Empty" description="Add your first item" />,
    );
    expect(container.textContent).toContain("Add your first item");
  });

  it("renders icon", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Empty" icon={<span data-testid="icon">📭</span>} />,
    );
    expect(container.querySelector("[data-testid='icon']")).toBeTruthy();
  });

  it("renders actions", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Empty" actions={<button>Add</button>} />,
    );
    expect(container.textContent).toContain("Add");
  });

  it("renders dashed variant", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Empty" variant="dashed" />,
    );
    expect(container.querySelector(".border-dashed")).toBeTruthy();
  });

  it("renders inline variant", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Empty" variant="inline" />,
    );
    expect(container.querySelector(".flex-row")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <EmptyState title="X" className="my-empty" />,
    );
    expect(container.querySelector(".my-empty")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <EmptyState title="Nothing here" description="Try again" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
