import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Card, CardGrid } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(<Card>Content</Card>);
    expect(container.textContent).toContain("Content");
  });

  it("renders title", () => {
    renderWithHarbor(<Card title="My Card">Body</Card>);
    expect(screen.getByText("My Card")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithHarbor(<Card description="Card desc">Body</Card>);
    expect(screen.getByText("Card desc")).toBeInTheDocument();
  });

  it("renders header slot", () => {
    renderWithHarbor(<Card header={<span>Header</span>}>Body</Card>);
    expect(screen.getByText("Header")).toBeInTheDocument();
  });

  it("renders footer slot", () => {
    renderWithHarbor(<Card footer={<span>Footer</span>}>Body</Card>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders leading icon", () => {
    renderWithHarbor(
      <Card leadingIcon={<span data-testid="icon">📦</span>}>Body</Card>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    const { container } = renderWithHarbor(<Card>Test</Card>);
    const div = container.querySelector(".rounded-2xl");
    expect(div?.className).toContain("hbr-card");
  });

  it("applies glass variant", () => {
    const { container } = renderWithHarbor(<Card variant="glass">Test</Card>);
    const div = container.querySelector(".rounded-2xl");
    expect(div?.className).toContain("backdrop-blur");
  });

  it("applies selected state", () => {
    const { container } = renderWithHarbor(<Card selected>Test</Card>);
    const div = container.querySelector("[aria-selected='true']");
    expect(div).toBeTruthy();
  });

  it("applies disabled state", () => {
    const { container } = renderWithHarbor(<Card disabled>Test</Card>);
    const div = container.querySelector("[aria-disabled='true']");
    expect(div).toBeTruthy();
  });

  it("fires onClick when not disabled", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(<Card onClick={onClick}>Clickable</Card>);
    await user.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <Card disabled onClick={onClick}>
        Disabled
      </Card>,
    );
    await user.click(screen.getByText("Disabled"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref", () => {
    const ref: React.RefObject<HTMLDivElement | null> = { current: null };
    renderWithHarbor(<Card ref={ref}>Test</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Card className="my-card">Test</Card>);
    expect(container.querySelector(".my-card")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Card title="Accessible" description="A card">
        Content
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("CardGrid", () => {
  it("renders children in grid", () => {
    const { container } = renderWithHarbor(
      <CardGrid>
        <Card>A</Card>
        <Card>B</Card>
      </CardGrid>,
    );
    expect(container.querySelector(".grid")).toBeTruthy();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("applies cols class", () => {
    const { container } = renderWithHarbor(<CardGrid cols={3}>X</CardGrid>);
    const grid = container.querySelector(".grid");
    expect(grid?.className).toContain("md:grid-cols-3");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<CardGrid className="my-grid">X</CardGrid>);
    expect(container.querySelector(".my-grid")).toBeTruthy();
  });
});
