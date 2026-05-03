import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Container } from "./Container";

describe("Container", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(<Container>Content</Container>);
    expect(container.textContent).toContain("Content");
  });

  it("applies mx-auto w-full classes", () => {
    const { container } = renderWithHarbor(<Container>Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("mx-auto");
    expect(div?.className).toContain("w-full");
  });

  it("applies size xl by default", () => {
    const { container } = renderWithHarbor(<Container>Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-");
  });

  it("applies size sm", () => {
    const { container } = renderWithHarbor(<Container size="sm">Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-");
  });

  it("applies size full", () => {
    const { container } = renderWithHarbor(<Container size="full">Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("max-w-none");
  });

  it("applies padded classes by default", () => {
    const { container } = renderWithHarbor(<Container>Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).toContain("px-4");
  });

  it("removes padding when padded=false", () => {
    const { container } = renderWithHarbor(<Container padded={false}>Test</Container>);
    const div = container.querySelector("div");
    expect(div?.className).not.toContain("px-4");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Container className="my-ct">X</Container>);
    expect(container.querySelector(".my-ct")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Container>Accessible</Container>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
