import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { WindowFrame } from "./WindowFrame";

describe("WindowFrame", () => {
  it("renders children", () => {
    const { container } = renderWithHarbor(
      <WindowFrame>Content</WindowFrame>,
    );
    expect(container.textContent).toContain("Content");
  });

  it("renders title", () => {
    renderWithHarbor(<WindowFrame title="My Window">Body</WindowFrame>);
    expect(screen.getByText("My Window")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    renderWithHarbor(
      <WindowFrame title="App" subtitle="v1.0">
        Body
      </WindowFrame>,
    );
    expect(screen.getByText("v1.0")).toBeInTheDocument();
  });

  it("renders icon", () => {
    renderWithHarbor(
      <WindowFrame icon={<span data-testid="icon">📁</span>}>Body</WindowFrame>,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders toolbar when provided", () => {
    renderWithHarbor(
      <WindowFrame toolbar={<span>Toolbar items</span>}>Body</WindowFrame>,
    );
    expect(screen.getByText("Toolbar items")).toBeInTheDocument();
  });

  it("renders statusBar when provided", () => {
    renderWithHarbor(
      <WindowFrame statusBar={<span>Ln 1, Col 1</span>}>Body</WindowFrame>,
    );
    expect(screen.getByText("Ln 1, Col 1")).toBeInTheDocument();
  });

  it("renders macOS traffic lights by default", () => {
    const { container } = renderWithHarbor(<WindowFrame>Body</WindowFrame>);
    const buttons = container.querySelectorAll("button");
    // 3 traffic light buttons (close, minimize, maximize)
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it("renders windows chrome buttons", () => {
    renderWithHarbor(
      <WindowFrame chromeStyle="windows">Body</WindowFrame>,
    );
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
    expect(screen.getByLabelText("Minimize")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximize")).toBeInTheDocument();
  });

  it("fires onClose from macOS close button", async () => {
    const onClose = vi.fn();
    const { user, container } = renderWithHarbor(
      <WindowFrame onClose={onClose}>Body</WindowFrame>,
    );
    const buttons = container.querySelectorAll("button");
    await user.click(buttons[0]); // First traffic light = close
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <WindowFrame className="my-window">Body</WindowFrame>,
    );
    expect(container.querySelector(".my-window")).toBeTruthy();
  });

  it("applies bodyClassName", () => {
    const { container } = renderWithHarbor(
      <WindowFrame bodyClassName="my-body">Body</WindowFrame>,
    );
    expect(container.querySelector(".my-body")).toBeTruthy();
  });

  it("a11y: macOS traffic light buttons have accessible names", async () => {
    const { container } = renderWithHarbor(
      <WindowFrame title="Window" chromeStyle="macos">
        Content
      </WindowFrame>,
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Minimize" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Maximize" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
