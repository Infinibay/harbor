import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { StatusBar, StatusItem, StatusSeparator } from "./StatusBar";

describe("StatusBar", () => {
  it("renders children with role=status", () => {
    const { container } = renderWithHarbor(
      <StatusBar>Info text</StatusBar>,
    );
    expect(container.querySelector("[role='status']")).toBeTruthy();
    expect(container.textContent).toContain("Info text");
  });

  it("applies font-mono and text classes", () => {
    const { container } = renderWithHarbor(<StatusBar>X</StatusBar>);
    const div = container.querySelector("[role='status']");
    expect(div?.className).toContain("font-mono");
    expect(div?.className).toContain("text-[11px]");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <StatusBar className="my-status">X</StatusBar>,
    );
    expect(container.querySelector(".my-status")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<StatusBar>Ready</StatusBar>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("StatusItem", () => {
  it("renders children text", () => {
    renderWithHarbor(<StatusItem>Ln 42</StatusItem>);
    expect(screen.getByText("Ln 42")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    renderWithHarbor(<StatusItem icon={<span>🔍</span>}>Search</StatusItem>);
    expect(screen.getByText("🔍")).toBeInTheDocument();
  });

  it("applies success tone", () => {
    const { container } = renderWithHarbor(
      <StatusItem tone="success">OK</StatusItem>,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("text-emerald-300");
  });

  it("applies danger tone", () => {
    const { container } = renderWithHarbor(
      <StatusItem tone="danger">Error</StatusItem>,
    );
    const btn = container.querySelector("button");
    expect(btn?.className).toContain("text-rose-300");
  });

  it("fires onClick when provided", async () => {
    const onClick = vi.fn();
    const { user } = renderWithHarbor(
      <StatusItem onClick={onClick}>Clickable</StatusItem>,
    );
    await user.click(screen.getByText("Clickable"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when no onClick", () => {
    renderWithHarbor(<StatusItem>Static</StatusItem>);
    expect(screen.getByText("Static").closest("button")).toBeDisabled();
  });
});

describe("StatusSeparator", () => {
  it("renders a · separator", () => {
    const { container } = renderWithHarbor(<StatusSeparator />);
    expect(container.textContent).toContain("·");
  });
});
