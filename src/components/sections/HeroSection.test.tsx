import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { HeroSection } from "./HeroSection";

describe("HeroSection", () => {
  it("renders title", () => {
    renderWithHarbor(<HeroSection title="Welcome" />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("renders highlight text", () => {
    renderWithHarbor(<HeroSection title="Hello" highlight="World" />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("renders description", () => {
    renderWithHarbor(<HeroSection title="Hi" description="A subtitle" />);
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
  });

  it("renders eyebrow", () => {
    renderWithHarbor(<HeroSection title="Hi" eyebrow="New release" />);
    expect(screen.getByText("New release")).toBeInTheDocument();
  });

  it("renders eyebrow with pulse dot", () => {
    const { container } = renderWithHarbor(
      <HeroSection title="Hi" eyebrow="New" />,
    );
    const dot = container.querySelector(".animate-pulse");
    expect(dot).toBeTruthy();
  });

  it("renders primaryCta slot", () => {
    renderWithHarbor(<HeroSection title="Hi" primaryCta={<button>Get Started</button>} />);
    expect(screen.getByText("Get Started")).toBeInTheDocument();
  });

  it("renders secondaryCta slot", () => {
    renderWithHarbor(<HeroSection title="Hi" secondaryCta={<button>Learn More</button>} />);
    expect(screen.getByText("Learn More")).toBeInTheDocument();
  });

  it("renders media slot", () => {
    renderWithHarbor(
      <HeroSection title="Hi" media={<img alt="Hero image" src="/hero.png" />} />,
    );
    expect(screen.getByAltText("Hero image")).toBeInTheDocument();
  });

  it("renders centered layout by default", () => {
    const { container } = renderWithHarbor(<HeroSection title="Centered" />);
    const section = container.querySelector("section");
    expect(section).toBeTruthy();
  });

  it("renders split layout with grid", () => {
    const { container } = renderWithHarbor(
      <HeroSection title="Split" layout="split" media={<span>Media</span>} />,
    );
    const section = container.querySelector("section");
    expect(section?.className).toContain("grid");
    expect(section?.className).toContain("md:grid-cols-2");
  });

  it("renders title in h1 element", () => {
    const { container } = renderWithHarbor(<HeroSection title="Heading" />);
    const h1 = container.querySelector("h1");
    expect(h1).toBeTruthy();
    expect(h1?.textContent).toContain("Heading");
  });

  it("applies text-center for centered layout", () => {
    const { container } = renderWithHarbor(<HeroSection title="Hi" />);
    const centered = container.querySelector(".text-center");
    expect(centered).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <HeroSection title="Hi" className="my-hero" />,
    );
    expect(container.querySelector(".my-hero")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <HeroSection
        title="Accessible"
        description="A hero section"
        primaryCta={<button>CTA</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
