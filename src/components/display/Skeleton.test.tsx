import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Skeleton, SkeletonText } from "./Skeleton";

describe("Skeleton", () => {
  it("renders with default classes", () => {
    const { container } = renderWithHarbor(<Skeleton />);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
    expect(span?.className).toContain("shimmer");
  });

  it("renders with circle class when circle=true", () => {
    const { container } = renderWithHarbor(<Skeleton circle />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("rounded-full");
  });

  it("renders with rounded-md by default", () => {
    const { container } = renderWithHarbor(<Skeleton />);
    const span = container.querySelector("span");
    expect(span?.className).toContain("rounded-md");
  });

  it("sets width and height via style", () => {
    const { container } = renderWithHarbor(<Skeleton width={200} height={20} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("style")).toContain("width");
    expect(span?.getAttribute("style")).toContain("height");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Skeleton className="my-sk" />);
    expect(container.querySelector(".my-sk")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Skeleton width={100} height={20} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SkeletonText", () => {
  it("renders default 3 lines", () => {
    const { container } = renderWithHarbor(<SkeletonText />);
    const skeletons = container.querySelectorAll("span.shimmer");
    expect(skeletons.length).toBe(3);
  });

  it("renders custom number of lines", () => {
    const { container } = renderWithHarbor(<SkeletonText lines={5} />);
    const skeletons = container.querySelectorAll("span.shimmer");
    expect(skeletons.length).toBe(5);
  });

  it("last line is 60% width", () => {
    const { container } = renderWithHarbor(<SkeletonText lines={3} />);
    const skeletons = container.querySelectorAll("span.shimmer");
    const last = skeletons[skeletons.length - 1];
    expect(last?.getAttribute("style")).toContain("60%");
  });
});
