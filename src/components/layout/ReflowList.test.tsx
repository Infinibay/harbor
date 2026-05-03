import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ReflowList } from "./ReflowList";

describe("ReflowList", () => {
  it("renders children in a flex container", () => {
    const { container } = renderWithHarbor(
      <ReflowList>
        <span>A</span>
        <span>B</span>
      </ReflowList>,
    );
    expect(container.querySelector(".flex")).toBeTruthy();
    expect(container.textContent).toContain("A");
    expect(container.textContent).toContain("B");
  });

  it("applies flex-wrap by default", () => {
    const { container } = renderWithHarbor(<ReflowList>X</ReflowList>);
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("flex-wrap");
  });

  it("removes wrap when wrap=false", () => {
    const { container } = renderWithHarbor(
      <ReflowList wrap={false}>X</ReflowList>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).not.toContain("flex-wrap");
  });

  it("applies default gap 8 via style", () => {
    const { container } = renderWithHarbor(<ReflowList>X</ReflowList>);
    const div = container.querySelector(".flex");
    expect(div?.getAttribute("style")).toContain("8");
  });

  it("applies custom gap", () => {
    const { container } = renderWithHarbor(
      <ReflowList gap={16}>X</ReflowList>,
    );
    const div = container.querySelector(".flex");
    expect(div?.getAttribute("style")).toContain("16");
  });

  it("applies align class", () => {
    const { container } = renderWithHarbor(
      <ReflowList align="end">X</ReflowList>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("items-end");
  });

  it("applies justify class", () => {
    const { container } = renderWithHarbor(
      <ReflowList justify="center">X</ReflowList>,
    );
    const div = container.querySelector(".flex");
    expect(div?.className).toContain("justify-center");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ReflowList className="my-list">X</ReflowList>,
    );
    expect(container.querySelector(".my-list")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <ReflowList>
        <span>A</span>
        <span>B</span>
      </ReflowList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
