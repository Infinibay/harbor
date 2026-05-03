import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ContentSwap } from "./ContentSwap";

describe("ContentSwap", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a">Hello</ContentSwap>,
    );
    expect(container.textContent).toContain("Hello");
  });

  it("renders with default fade variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a">Content</ContentSwap>,
    );
    // motion.div renders with opacity: 0 in initial state
    const motionDiv = container.querySelector("[style]");
    expect(motionDiv).toBeTruthy();
  });

  it("renders with fade-up variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="fade-up">
        Up content
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Up content");
  });

  it("renders with scale variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="scale">
        Scaled
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Scaled");
  });

  it("renders with blur variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="blur">
        Blurred
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Blurred");
  });

  it("renders with slide-left variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="slide-left">
        Left
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Left");
  });

  it("renders with slide-right variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="slide-right">
        Right
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Right");
  });

  it("renders with none variant (no animation)", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" variant="none">
        No anim
      </ContentSwap>,
    );
    expect(container.textContent).toContain("No anim");
  });

  it("renders with wait mode (default)", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" mode="wait">
        Wait mode
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Wait mode");
  });

  it("renders with sync mode", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" mode="sync">
        Sync mode
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Sync mode");
  });

  it("renders with crossfade mode (absolute positioning)", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" mode="crossfade">
        Crossfade
      </ContentSwap>,
    );
    // crossfade renders a wrapper div with position: relative
    const wrapper = container.querySelector("[style*='relative']");
    expect(wrapper).toBeTruthy();
    // Inner motion.div has position: absolute
    const inner = container.querySelector("[style*='absolute']");
    expect(inner).toBeTruthy();
    expect(container.textContent).toContain("Crossfade");
  });

  it("applies custom duration", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" duration={500}>
        Slow
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Slow");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" className="my-swap">
        Styled
      </ContentSwap>,
    );
    expect(container.querySelector(".my-swap")).toBeTruthy();
  });

  it("applies custom style", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" style={{ color: "red" }}>
        Styled
      </ContentSwap>,
    );
    const el = container.querySelector("[style*='red']");
    expect(el).toBeTruthy();
  });

  it("accepts customVariants overriding built-in variant", () => {
    const { container } = renderWithHarbor(
      <ContentSwap
        id="a"
        customVariants={{
          initial: { opacity: 0.5 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }}
      >
        Custom
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Custom");
  });

  it("renders with animateInitial=false", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a" animateInitial={false}>
        No initial
      </ContentSwap>,
    );
    expect(container.textContent).toContain("No initial");
  });

  it("renders with numeric id", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id={42}>Numeric</ContentSwap>,
    );
    expect(container.textContent).toContain("Numeric");
  });

  it("renders complex children", () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a">
        <div>
          <h1>Title</h1>
          <p>Paragraph</p>
        </div>
      </ContentSwap>,
    );
    expect(container.textContent).toContain("Title");
    expect(container.textContent).toContain("Paragraph");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ContentSwap id="a">Accessible content</ContentSwap>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
