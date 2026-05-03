import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Carousel, type CarouselSlide } from "./Carousel";

const slides: CarouselSlide[] = [
  { id: "a", content: <div>Slide A</div> },
  { id: "b", content: <div>Slide B</div> },
  { id: "c", content: <div>Slide C</div> },
];

describe("Carousel", () => {
  it("renders the initial slide", () => {
    renderWithHarbor(<Carousel slides={slides} />);
    expect(screen.getByText("Slide A")).toBeInTheDocument();
  });

  it("renders initial slide at given index", () => {
    renderWithHarbor(<Carousel slides={slides} initial={1} />);
    expect(screen.getByText("Slide B")).toBeInTheDocument();
  });

  it("renders next slide on right arrow click", async () => {
    const { user } = renderWithHarbor(<Carousel slides={slides} />);
    const arrows = screen.getAllByText("›");
    await user.click(arrows[0]);
    expect(screen.getByText("Slide B")).toBeInTheDocument();
  });

  it("renders previous slide on left arrow click", async () => {
    const { user } = renderWithHarbor(<Carousel slides={slides} initial={1} />);
    const arrows = screen.getAllByText("‹");
    await user.click(arrows[0]);
    expect(screen.getByText("Slide A")).toBeInTheDocument();
  });

  it("wraps around to last slide from first", async () => {
    const { user } = renderWithHarbor(<Carousel slides={slides} />);
    const arrows = screen.getAllByText("‹");
    await user.click(arrows[0]);
    expect(screen.getByText("Slide C")).toBeInTheDocument();
  });

  it("wraps around to first slide from last", async () => {
    const { user } = renderWithHarbor(
      <Carousel slides={slides} initial={2} />,
    );
    const arrows = screen.getAllByText("›");
    await user.click(arrows[0]);
    expect(screen.getByText("Slide A")).toBeInTheDocument();
  });

  it("renders dot buttons when showDots=true (default)", () => {
    const { container } = renderWithHarbor(<Carousel slides={slides} />);
    const dots = container.querySelectorAll("button.group");
    expect(dots.length).toBe(3);
  });

  it("hides dots when showDots=false", () => {
    const { container } = renderWithHarbor(
      <Carousel slides={slides} showDots={false} />,
    );
    expect(container.querySelector("button.group")).toBeNull();
  });

  it("hides arrows when showArrows=false", () => {
    renderWithHarbor(<Carousel slides={slides} showArrows={false} />);
    expect(screen.queryByText("‹")).toBeNull();
    expect(screen.queryByText("›")).toBeNull();
  });

  it("navigates to slide on dot click", async () => {
    const { user, container } = renderWithHarbor(<Carousel slides={slides} />);
    const dots = container.querySelectorAll("button.group");
    await user.click(dots[2]); // Click third dot
    expect(screen.getByText("Slide C")).toBeInTheDocument();
  });

  it("applies aspect-video class by default", () => {
    const { container } = renderWithHarbor(<Carousel slides={slides} />);
    const wrapper = container.querySelector(".aspect-video");
    expect(wrapper).toBeTruthy();
  });

  it("applies aspect-square class", () => {
    const { container } = renderWithHarbor(
      <Carousel slides={slides} aspect="square" />,
    );
    expect(container.querySelector(".aspect-square")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Carousel slides={slides} className="my-carousel" />,
    );
    expect(container.querySelector(".my-carousel")).toBeTruthy();
  });

  it("renders with a single slide", () => {
    const single = [{ id: "only", content: <div>Only</div> }];
    renderWithHarbor(<Carousel slides={single} />);
    expect(screen.getByText("Only")).toBeInTheDocument();
  });
});
