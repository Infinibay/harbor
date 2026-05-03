import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { VMConsole } from "./VMConsole";

describe("VMConsole", () => {
  it("renders VM name in title bar", () => {
    renderWithHarbor(<VMConsole name="web-01" />);
    // Name appears in both title bar and placeholder Terminal title — use getAllByText
    const matches = screen.getAllByText("web-01");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("renders subtitle when provided", () => {
    renderWithHarbor(<VMConsole name="web-01" subtitle="192.168.1.1" />);
    expect(screen.getByText("192.168.1.1")).toBeInTheDocument();
  });

  it("renders resolution when provided", () => {
    const { container } = renderWithHarbor(
      <VMConsole name="web-01" resolution="80×24" />,
    );
    expect(container.textContent).toContain("80×24");
  });

  it("renders Fullscreen button", () => {
    renderWithHarbor(<VMConsole name="web-01" />);
    expect(screen.getByTitle("Fullscreen")).toBeInTheDocument();
  });

  it("renders Connect button when onConnect is provided and not connected", () => {
    renderWithHarbor(<VMConsole name="web-01" onConnect={vi.fn()} />);
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("renders Disconnect button when connected (terminal provided)", () => {
    const adapter = {
      mount: vi.fn(),
      unmount: vi.fn(),
      write: vi.fn(),
      onData: vi.fn(() => () => {}),
      resize: vi.fn(),
    };
    renderWithHarbor(
      <VMConsole name="web-01" terminal={adapter} onDisconnect={vi.fn()} />,
    );
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });

  it("fires onConnect when Connect button is clicked", async () => {
    const onConnect = vi.fn();
    const { user } = renderWithHarbor(
      <VMConsole name="web-01" onConnect={onConnect} />,
    );
    await user.click(screen.getByText("Connect"));
    expect(onConnect).toHaveBeenCalledTimes(1);
  });

  it("fires onDisconnect and sets disconnected on Disconnect click", async () => {
    const onDisconnect = vi.fn();
    const adapter = {
      mount: vi.fn(),
      unmount: vi.fn(),
      write: vi.fn(),
      onData: vi.fn(() => () => {}),
      resize: vi.fn(),
    };
    const { user } = renderWithHarbor(
      <VMConsole
        name="web-01"
        terminal={adapter}
        onDisconnect={onDisconnect}
      />,
    );
    await user.click(screen.getByText("Disconnect"));
    expect(onDisconnect).toHaveBeenCalledTimes(1);
  });

  it("renders placeholder content when no terminal adapter", () => {
    const { container } = renderWithHarbor(<VMConsole name="web-01" />);
    expect(container.textContent).toContain("Terminal not connected");
  });

  it("renders custom placeholder when provided", () => {
    renderWithHarbor(
      <VMConsole
        name="web-01"
        placeholder={<span data-testid="custom-ph">Custom placeholder</span>}
      />,
    );
    expect(screen.getByTestId("custom-ph")).toBeInTheDocument();
  });

  it("renders actions slot", () => {
    renderWithHarbor(
      <VMConsole
        name="web-01"
        actions={<span data-testid="action">Power</span>}
      />,
    );
    expect(screen.getByTestId("action")).toBeInTheDocument();
  });

  it("calls terminal.mount on render and unmount on cleanup", () => {
    const adapter = {
      mount: vi.fn(),
      unmount: vi.fn(),
      write: vi.fn(),
      onData: vi.fn(() => () => {}),
      resize: vi.fn(),
    };
    const { unmount } = renderWithHarbor(
      <VMConsole name="web-01" terminal={adapter} />,
    );
    expect(adapter.mount).toHaveBeenCalledTimes(1);
    unmount();
    expect(adapter.unmount).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <VMConsole name="web-01" className="my-console" />,
    );
    expect(container.querySelector(".my-console")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <VMConsole name="web-01" subtitle="test server" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
