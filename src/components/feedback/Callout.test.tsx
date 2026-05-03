import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Callout } from "./Callout";

describe("Callout", () => {
  it("renders title when open=true", () => {
    renderWithHarbor(<Callout open={true} title="Welcome" />);
    expect(screen.getByText("Welcome")).toBeInTheDocument();
  });

  it("renders children when open=true", () => {
    renderWithHarbor(<Callout open={true}>This is a callout</Callout>);
    expect(screen.getByText("This is a callout")).toBeInTheDocument();
  });

  it("renders nothing when open=false", () => {
    const { container } = renderWithHarbor(
      <Callout open={false} title="Hidden" />,
    );
    // Portal doesn't render content when open=false
    expect(screen.queryByText("Hidden")).toBeNull();
  });

  it("renders step indicator when step and total provided", () => {
    renderWithHarbor(<Callout open={true} step={2} total={4} />);
    expect(screen.getByText(/Step 2 of 4/)).toBeInTheDocument();
  });

  it("renders dot indicators for total steps", () => {
    const { container } = renderWithHarbor(
      <Callout open={true} step={1} total={3} />,
    );
    const dots = document.querySelectorAll("span.rounded-full.w-1\\.5");
    expect(dots.length).toBe(3);
  });

  it("renders Back button when onPrev provided", () => {
    renderWithHarbor(<Callout open={true} onPrev={vi.fn()} />);
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("does not render Back button when onPrev not provided", () => {
    renderWithHarbor(<Callout open={true} />);
    expect(screen.queryByText("Back")).toBeNull();
  });

  it("renders Next button when step < total", () => {
    renderWithHarbor(<Callout open={true} step={1} total={3} />);
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders Done button when step equals total", () => {
    renderWithHarbor(<Callout open={true} step={3} total={3} />);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("renders Done button when no step/total", () => {
    renderWithHarbor(<Callout open={true} />);
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("fires onClose when Done is clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(<Callout open={true} onClose={onClose} />);
    await user.click(screen.getByText("Done"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fires onNext when Next is clicked", async () => {
    const onNext = vi.fn();
    const { user } = renderWithHarbor(
      <Callout open={true} step={1} total={3} onNext={onNext} />,
    );
    await user.click(screen.getByText("Next"));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("fires onPrev when Back is clicked", async () => {
    const onPrev = vi.fn();
    const { user } = renderWithHarbor(
      <Callout open={true} onPrev={onPrev} />,
    );
    await user.click(screen.getByText("Back"));
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("renders via Portal (elements in document, not just container)", () => {
    const { container } = renderWithHarbor(<Callout open={true} title="Portal" />);
    // The callout renders in a Portal, so it's in document but may not be in container
    expect(screen.getByText("Portal")).toBeInTheDocument();
  });

  it("applies custom className to the tip", () => {
    renderWithHarbor(
      <Callout open={true} className="my-callout" title="Styled" />,
    );
    const el = document.querySelector(".my-callout");
    expect(el).toBeTruthy();
  });
});
