import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Prose } from "./Prose";

describe("Prose", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <Prose>
        <p>Hello world</p>
      </Prose>,
    );
    expect(container.textContent).toContain("Hello world");
  });

  it("applies md size by default", () => {
    const { container } = renderWithHarbor(<Prose>X</Prose>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-[66ch]");
  });

  it("applies sm size", () => {
    const { container } = renderWithHarbor(<Prose size="sm">X</Prose>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-[54ch]");
  });

  it("applies lg size", () => {
    const { container } = renderWithHarbor(<Prose size="lg">X</Prose>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-[72ch]");
  });

  it("applies mx-auto for centering", () => {
    const { container } = renderWithHarbor(<Prose>X</Prose>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("mx-auto");
  });

  it("uses semantic text color for the base class", () => {
    const { container } = renderWithHarbor(<Prose>X</Prose>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("text-[rgb(var(--harbor-text-muted))]");
  });

  it("renders heading children", () => {
    const { container } = renderWithHarbor(
      <Prose>
        <h1>Title</h1>
        <h2>Subtitle</h2>
        <p>Paragraph</p>
      </Prose>,
    );
    expect(container.querySelector("h1")).toBeTruthy();
    expect(container.querySelector("h2")).toBeTruthy();
    expect(container.textContent).toContain("Paragraph");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Prose className="my-prose">X</Prose>,
    );
    expect(container.querySelector(".my-prose")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Prose>
        <h1>Heading</h1>
        <p>Paragraph content</p>
      </Prose>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
