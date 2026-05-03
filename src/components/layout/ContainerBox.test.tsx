import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { ContainerBox } from "./ContainerBox";

describe("ContainerBox", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(<ContainerBox>Content</ContainerBox>);
    expect(container.textContent).toContain("Content");
  });

  it("sets containerType style to inline-size by default", () => {
    const { container } = renderWithHarbor(<ContainerBox>X</ContainerBox>);
    const div = container.querySelector("div");
    expect(div?.getAttribute("style")).toContain("inline-size");
  });

  it("sets containerType to size", () => {
    const { container } = renderWithHarbor(
      <ContainerBox type="size">X</ContainerBox>,
    );
    const div = container.querySelector("div");
    expect(div?.getAttribute("style")).toContain("size");
  });

  it("sets containerName when name provided", () => {
    const { container } = renderWithHarbor(
      <ContainerBox name="sidebar">X</ContainerBox>,
    );
    const div = container.querySelector("div");
    expect(div?.getAttribute("style")).toContain("sidebar");
  });

  it("forwards ref", () => {
    const ref: React.RefObject<HTMLDivElement | null> = { current: null };
    renderWithHarbor(<ContainerBox ref={ref}>X</ContainerBox>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <ContainerBox className="my-box">X</ContainerBox>,
    );
    expect(container.querySelector(".my-box")).toBeTruthy();
  });

  it("applies custom style", () => {
    const { container } = renderWithHarbor(
      <ContainerBox style={{ color: "red" }}>X</ContainerBox>,
    );
    const div = container.querySelector("div");
    expect(div?.getAttribute("style")).toContain("red");
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<ContainerBox>Accessible</ContainerBox>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
