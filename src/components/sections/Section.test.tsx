import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Section } from "./Section";

describe("Section", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <Section>Content</Section>,
    );
    expect(container.textContent).toContain("Content");
  });

  it("renders title", () => {
    renderWithHarbor(<Section title="My Section">Body</Section>);
    expect(screen.getByText("My Section")).toBeInTheDocument();
  });

  it("renders title in h2 element", () => {
    const { container } = renderWithHarbor(<Section title="Heading">X</Section>);
    const h2 = container.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2?.textContent).toContain("Heading");
  });

  it("renders description", () => {
    renderWithHarbor(
      <Section title="T" description="A description">Body</Section>,
    );
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("renders kicker", () => {
    renderWithHarbor(<Section title="T" kicker="Features">Body</Section>);
    expect(screen.getByText("Features")).toBeInTheDocument();
  });

  it("renders kicker with decorative line", () => {
    const { container } = renderWithHarbor(
      <Section title="T" kicker="K">X</Section>,
    );
    const line = container.querySelector("span.h-px.w-6");
    expect(line).toBeTruthy();
  });

  it("renders actions slot", () => {
    renderWithHarbor(
      <Section title="T" actions={<button>Click me</button>}>Body</Section>,
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("sets section id attribute", () => {
    const { container } = renderWithHarbor(
      <Section id="features">Content</Section>,
    );
    const section = container.querySelector("section");
    expect(section?.getAttribute("id")).toBe("features");
  });

  it("applies compact spacing", () => {
    const { container } = renderWithHarbor(
      <Section spacing="compact">X</Section>,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-6");
  });

  it("applies default spacing", () => {
    const { container } = renderWithHarbor(<Section>X</Section>);
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-12");
  });

  it("applies loose spacing", () => {
    const { container } = renderWithHarbor(
      <Section spacing="loose">X</Section>,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("py-20");
  });

  it("applies centered alignment", () => {
    const { container } = renderWithHarbor(
      <Section title="T" align="center">X</Section>,
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("items-center");
    expect(header?.className).toContain("text-center");
  });

  it("applies left alignment by default", () => {
    const { container } = renderWithHarbor(
      <Section title="T" align="left">X</Section>,
    );
    const header = container.querySelector("header");
    expect(header?.className).toContain("items-start");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Section className="my-section">X</Section>,
    );
    expect(container.querySelector(".my-section")).toBeTruthy();
  });

  it("renders without header when no title/description/kicker/actions", () => {
    const { container } = renderWithHarbor(<Section>Just children</Section>);
    expect(container.querySelector("header")).toBeNull();
    expect(container.textContent).toContain("Just children");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Section
        kicker="Kicker"
        title="Accessible Section"
        description="A section"
        actions={<button>Action</button>}
      >
        Content
      </Section>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
