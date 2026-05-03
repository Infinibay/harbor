import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { SplitSection } from "./SplitSection";

describe("SplitSection", () => {
  it("renders title", () => {
    renderWithHarbor(<SplitSection title="Feature" media={<span>Image</span>} />);
    expect(screen.getByText("Feature")).toBeInTheDocument();
  });

  it("renders title in h2 element", () => {
    const { container } = renderWithHarbor(
      <SplitSection title="Heading" media={<span>M</span>} />,
    );
    const h2 = container.querySelector("h2");
    expect(h2).toBeTruthy();
  });

  it("renders kicker", () => {
    renderWithHarbor(
      <SplitSection title="T" kicker="New" media={<span>M</span>} />,
    );
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithHarbor(
      <SplitSection title="T" description="A feature" media={<span>M</span>} />,
    );
    expect(screen.getByText("A feature")).toBeInTheDocument();
  });

  it("renders media slot", () => {
    renderWithHarbor(
      <SplitSection title="T" media={<span data-testid="media">Visual</span>} />,
    );
    expect(screen.getByTestId("media")).toBeInTheDocument();
  });

  it("renders children slot", () => {
    renderWithHarbor(
      <SplitSection title="T" media={<span>M</span>}>
        <button>Learn more</button>
      </SplitSection>,
    );
    expect(screen.getByText("Learn more")).toBeInTheDocument();
  });

  it("applies grid layout", () => {
    const { container } = renderWithHarbor(
      <SplitSection title="T" media={<span>M</span>} />,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("grid");
    expect(section?.className).toContain("md:grid-cols-2");
  });

  it("applies reverse order class", () => {
    const { container } = renderWithHarbor(
      <SplitSection title="T" media={<span>M</span>} reverse />,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("order-2");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <SplitSection title="T" media={<span>M</span>} className="my-split" />,
    );
    expect(container.querySelector(".my-split")).toBeTruthy();
  });

  it("renders kicker decorative line", () => {
    const { container } = renderWithHarbor(
      <SplitSection title="T" kicker="K" media={<span>M</span>} />,
    );
    const line = container.querySelector("span.h-px.w-6");
    expect(line).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <SplitSection
        kicker="Section"
        title="Accessible Split"
        description="A split section"
        media={<span>Visual</span>}
      >
        <button>Action</button>
      </SplitSection>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
