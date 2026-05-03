import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "./Toolbar";

describe("Toolbar", () => {
  it("renders children with role=toolbar", () => {
    const { container } = renderWithHarbor(
      <Toolbar>
        <button>A</button>
        <button>B</button>
      </Toolbar>,
    );
    expect(container.querySelector("[role='toolbar']")).toBeTruthy();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("applies horizontal classes by default", () => {
    const { container } = renderWithHarbor(<Toolbar>X</Toolbar>);
    const toolbar = container.querySelector("[role='toolbar']");
    expect(toolbar?.className).toContain("flex");
    expect(toolbar?.className).toContain("items-center");
  });

  it("applies vertical classes", () => {
    const { container } = renderWithHarbor(
      <Toolbar orientation="vertical">X</Toolbar>,
    );
    const toolbar = container.querySelector("[role='toolbar']");
    expect(toolbar?.className).toContain("flex-col");
  });

  it("applies floating variant classes", () => {
    const { container } = renderWithHarbor(
      <Toolbar variant="floating">X</Toolbar>,
    );
    const toolbar = container.querySelector("[role='toolbar']");
    expect(toolbar?.className).toContain("rounded-xl");
    expect(toolbar?.className).toContain("backdrop-blur-md");
  });

  it("does not apply floating classes for flat variant", () => {
    const { container } = renderWithHarbor(
      <Toolbar variant="flat">X</Toolbar>,
    );
    const toolbar = container.querySelector("[role='toolbar']");
    expect(toolbar?.className).not.toContain("backdrop-blur-md");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Toolbar className="my-tb">X</Toolbar>,
    );
    expect(container.querySelector(".my-tb")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Toolbar>
        <button>Action</button>
      </Toolbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ToolbarGroup", () => {
  it("renders children in inline-flex", () => {
    const { container } = renderWithHarbor(
      <ToolbarGroup>
        <button>A</button>
        <button>B</button>
      </ToolbarGroup>,
    );
    expect(container.querySelector(".inline-flex")).toBeTruthy();
    expect(container.textContent).toContain("A");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ToolbarGroup className="my-group">X</ToolbarGroup>,
    );
    expect(container.querySelector(".my-group")).toBeTruthy();
  });
});

describe("ToolbarSeparator", () => {
  it("renders vertical separator by default", () => {
    const { container } = renderWithHarbor(<ToolbarSeparator />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("w-px");
    expect(span?.className).toContain("h-5");
  });

  it("renders horizontal separator", () => {
    const { container } = renderWithHarbor(
      <ToolbarSeparator orientation="horizontal" />,
    );
    const span = container.querySelector("span");
    expect(span?.className).toContain("h-px");
    expect(span?.className).toContain("w-5");
  });
});
