import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { CompareSlider } from "./CompareSlider";

describe("CompareSlider", () => {
  it("renders before and after images", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/before.jpg" after="/after.jpg" />,
    );
    const imgs = container.querySelectorAll("img");
    expect(imgs.length).toBe(2);
    expect(imgs[0].getAttribute("src")).toBe("/before.jpg");
    expect(imgs[1].getAttribute("src")).toBe("/after.jpg");
  });

  it("renders default labels Before and After", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    expect(container.textContent).toContain("Before");
    expect(container.textContent).toContain("After");
  });

  it("renders custom labels", () => {
    const { container } = renderWithHarbor(
      <CompareSlider
        before="/a.jpg"
        after="/b.jpg"
        beforeLabel="Original"
        afterLabel="Edited"
      />,
    );
    expect(container.textContent).toContain("Original");
    expect(container.textContent).toContain("Edited");
  });

  it("applies cursor-col-resize class", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    expect(container.querySelector(".cursor-col-resize")).toBeTruthy();
  });

  it("renders divider handle with ⇆ symbol", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    expect(container.textContent).toContain("⇆");
  });

  it("sets default slider position at 50%", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" defaultValue={50} />,
    );
    const clip = container.querySelector("[style*='width: 50%']");
    expect(clip).toBeTruthy();
  });

  it("sets custom default slider position", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" defaultValue={75} />,
    );
    const clip = container.querySelector("[style*='width: 75%']");
    expect(clip).toBeTruthy();
  });

  it("applies aspect-video class", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    expect(container.querySelector(".aspect-video")).toBeTruthy();
  });

  it("renders images as non-draggable", () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    const imgs = container.querySelectorAll("img");
    imgs.forEach((img) => {
      expect(img.getAttribute("draggable")).toBe("false");
    });
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <CompareSlider
        before="/a.jpg"
        after="/b.jpg"
        className="my-slider"
      />,
    );
    expect(container.querySelector(".my-slider")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <CompareSlider before="/a.jpg" after="/b.jpg" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
