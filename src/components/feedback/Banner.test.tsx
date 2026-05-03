import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Banner } from "./Banner";

describe("Banner", () => {
  it("renders children text", () => {
    const { container } = renderWithHarbor(<Banner>Announcement</Banner>);
    expect(container.textContent).toContain("Announcement");
  });

  it("renders title", () => {
    renderWithHarbor(<Banner title="New feature">Check it out</Banner>);
    expect(screen.getByText("New feature")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    renderWithHarbor(
      <Banner icon={<span data-testid="ic">🚀</span>}>Launch</Banner>,
    );
    expect(screen.getByTestId("ic")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    renderWithHarbor(<Banner actions={<button>Learn more</button>}>Info</Banner>);
    expect(screen.getByText("Learn more")).toBeInTheDocument();
  });

  it("renders close button with aria-label when onClose provided", () => {
    renderWithHarbor(<Banner onClose={vi.fn()}>Dismissible</Banner>);
    expect(screen.getByLabelText("Dismiss")).toBeInTheDocument();
  });

  it("fires onClose when dismiss clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(<Banner onClose={onClose}>Bye</Banner>);
    await user.click(screen.getByLabelText("Dismiss"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose not provided", () => {
    renderWithHarbor(<Banner>No close</Banner>);
    expect(screen.queryByLabelText("Dismiss")).toBeNull();
  });

  it("renders when open=true (default)", () => {
    const { container } = renderWithHarbor(<Banner>Visible</Banner>);
    expect(container.textContent).toContain("Visible");
  });

  it("does not render when open=false", () => {
    const { container } = renderWithHarbor(<Banner open={false}>Hidden</Banner>);
    expect(container.textContent).not.toContain("Hidden");
  });

  it("applies info tone by default", () => {
    const { container } = renderWithHarbor(<Banner>Info</Banner>);
    expect(container.querySelector(".bg-sky-500\\/15")).toBeTruthy();
  });

  it("applies danger tone", () => {
    const { container } = renderWithHarbor(<Banner tone="danger">Danger</Banner>);
    expect(container.querySelector(".bg-rose-500\\/15")).toBeTruthy();
  });

  it("applies promo tone with gradient", () => {
    const { container } = renderWithHarbor(<Banner tone="promo">Sale!</Banner>);
    expect(container.querySelector(".bg-gradient-to-r")).toBeTruthy();
  });

  it("applies sticky class", () => {
    const { container } = renderWithHarbor(<Banner sticky>Sticky</Banner>);
    expect(container.querySelector(".sticky")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<Banner className="my-banner">X</Banner>);
    expect(container.querySelector(".my-banner")).toBeTruthy();
  });

  it("separates title and children with dot", () => {
    renderWithHarbor(<Banner title="Title">Body text</Banner>);
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <Banner title="Notice" onClose={vi.fn()}>
        Important update
      </Banner>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
