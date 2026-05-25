import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SegmentedControl, type SegmentedItem } from "./SegmentedControl";

const items: SegmentedItem[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week", icon: <span>📅</span> },
  { value: "month", label: "Month" },
];

describe("SegmentedControl", () => {
  it("renders item labels", () => {
    renderWithHarbor(<SegmentedControl items={items} />);
    expect(screen.getByText("Day")).toBeInTheDocument();
    expect(screen.getByText("Week")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    renderWithHarbor(<SegmentedControl items={items} />);
    expect(screen.getByText("📅")).toBeInTheDocument();
  });

  it("fires onChange on item click", async () => {
    const onChange = vi.fn();
    const { user } = renderWithHarbor(
      <SegmentedControl items={items} onChange={onChange} />,
    );
    await user.click(screen.getByText("Month"));
    expect(onChange).toHaveBeenCalledWith("month");
  });

  it("supports controlled value", () => {
    renderWithHarbor(<SegmentedControl items={items} value="week" />);
    const weekBtn = screen.getByText("Week").closest("button");
    expect(weekBtn?.className).toContain("text-[var(--harbor-state-selected-fg)]");
  });

  it("uses first item as default when no value/defaultValue", () => {
    renderWithHarbor(<SegmentedControl items={items} />);
    const dayBtn = screen.getByText("Day").closest("button");
    expect(dayBtn?.className).toContain("text-[var(--harbor-state-selected-fg)]");
  });

  it("respects defaultValue", () => {
    renderWithHarbor(<SegmentedControl items={items} defaultValue="month" />);
    const monthBtn = screen.getByText("Month").closest("button");
    expect(monthBtn?.className).toContain("text-[var(--harbor-state-selected-fg)]");
  });

  it("applies sm size class", () => {
    const { container } = renderWithHarbor(
      <SegmentedControl items={items} size="sm" />,
    );
    const wrapper = container.querySelector(".h-8");
    expect(wrapper).toBeTruthy();
  });

  it("applies md size by default", () => {
    const { container } = renderWithHarbor(
      <SegmentedControl items={items} size="md" />,
    );
    const wrapper = container.querySelector(".h-9");
    expect(wrapper).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SegmentedControl items={items} className="my-seg" />,
    );
    expect(container.querySelector(".my-seg")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<SegmentedControl items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
