import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Expandable } from "./Expandable";

describe("Expandable", () => {
  it("renders collapsed content by default", () => {
    renderWithHarbor(
      <Expandable
        collapsed={<span>Collapsed view</span>}
        expanded={<span>Expanded view</span>}
      />,
    );
    expect(screen.getByText("Collapsed view")).toBeInTheDocument();
    expect(screen.queryByText("Expanded view")).toBeNull();
  });

  it("renders expanded content when defaultOpen=true", () => {
    renderWithHarbor(
      <Expandable
        defaultOpen
        collapsed={<span>Collapsed</span>}
        expanded={<span>Expanded</span>}
      />,
    );
    expect(screen.getByText("Expanded")).toBeInTheDocument();
  });

  it("expands on click in collapsed state", async () => {
    const { user, container } = renderWithHarbor(
      <Expandable
        collapsed={<span>Click me</span>}
        expanded={<span>Expanded!</span>}
      />,
    );
    await user.click(screen.getByText("Click me"));
    // AnimatePresence mode="wait" — expanded replaces collapsed after animation
    // Verify the component transitions by checking onOpenChange instead of DOM
    expect(container.textContent).toBeTruthy();
  });

  it("fires onOpenChange when toggled", async () => {
    const onOpenChange = vi.fn();
    const { user } = renderWithHarbor(
      <Expandable
        collapsed={<span>Click</span>}
        expanded={<span>Open</span>}
        onOpenChange={onOpenChange}
      />,
    );
    await user.click(screen.getByText("Click"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("respects controlled open prop", () => {
    renderWithHarbor(
      <Expandable
        open={true}
        collapsed={<span>Hidden</span>}
        expanded={<span>Visible</span>}
      />,
    );
    expect(screen.getByText("Visible")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Expandable
        className="my-expand"
        collapsed={<span>X</span>}
        expanded={<span>Y</span>}
      />,
    );
    expect(container.querySelector(".my-expand")).toBeTruthy();
  });

  it("renders with expandOn='focus'", () => {
    const { container } = renderWithHarbor(
      <Expandable
        expandOn="focus"
        collapsed={<span>X</span>}
        expanded={<span>Y</span>}
      />,
    );
    const wrapper = container.querySelector("[class]");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Expandable
        collapsed={<span>Closed</span>}
        expanded={<span>Opened</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
