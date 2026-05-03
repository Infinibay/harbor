import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { BrowserTabs, type BrowserTab } from "./BrowserTabs";

const tabs: BrowserTab[] = [
  { id: "a", title: "Tab A" },
  { id: "b", title: "Tab B" },
  { id: "c", title: "Tab C", icon: <span>🌐</span> },
];

describe("BrowserTabs", () => {
  it("renders tab titles", () => {
    renderWithHarbor(
      <BrowserTabs tabs={tabs} activeId="a" onActivate={vi.fn()} />,
    );
    expect(screen.getByText("Tab A")).toBeInTheDocument();
    expect(screen.getByText("Tab B")).toBeInTheDocument();
    expect(screen.getByText("Tab C")).toBeInTheDocument();
  });

  it("fires onActivate when tab clicked", async () => {
    const onActivate = vi.fn();
    const { user } = renderWithHarbor(
      <BrowserTabs tabs={tabs} activeId="a" onActivate={onActivate} />,
    );
    await user.click(screen.getByText("Tab B"));
    expect(onActivate).toHaveBeenCalledWith("b");
  });

  it("renders close buttons when onClose provided", () => {
    renderWithHarbor(
      <BrowserTabs
        tabs={tabs}
        activeId="a"
        onActivate={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    const closeButtons = screen.getAllByLabelText("Close tab");
    expect(closeButtons.length).toBe(3);
  });

  it("fires onClose when close button clicked", async () => {
    const onClose = vi.fn();
    const { user } = renderWithHarbor(
      <BrowserTabs
        tabs={tabs}
        activeId="a"
        onActivate={vi.fn()}
        onClose={onClose}
      />,
    );
    const closeButtons = screen.getAllByLabelText("Close tab");
    await user.click(closeButtons[1]); // Close Tab B
    expect(onClose).toHaveBeenCalledWith("b");
  });

  it("renders New tab button when onNew provided", () => {
    renderWithHarbor(
      <BrowserTabs
        tabs={tabs}
        activeId="a"
        onActivate={vi.fn()}
        onNew={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("New tab")).toBeInTheDocument();
  });

  it("does not render New tab button when onNew not provided", () => {
    renderWithHarbor(
      <BrowserTabs tabs={tabs} activeId="a" onActivate={vi.fn()} />,
    );
    expect(screen.queryByLabelText("New tab")).toBeNull();
  });

  it("fires onNew when + button clicked", async () => {
    const onNew = vi.fn();
    const { user } = renderWithHarbor(
      <BrowserTabs
        tabs={tabs}
        activeId="a"
        onActivate={vi.fn()}
        onNew={onNew}
      />,
    );
    await user.click(screen.getByLabelText("New tab"));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it("renders loading spinner for loading tabs", () => {
    const loadingTabs: BrowserTab[] = [
      { id: "a", title: "Loading", loading: true },
    ];
    const { container } = renderWithHarbor(
      <BrowserTabs tabs={loadingTabs} activeId="a" onActivate={vi.fn()} />,
    );
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeTruthy();
  });

  it("renders pinned tabs without close button", () => {
    const pinnedTabs: BrowserTab[] = [
      { id: "a", title: "Pinned", pinned: true },
    ];
    renderWithHarbor(
      <BrowserTabs
        tabs={pinnedTabs}
        activeId="a"
        onActivate={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.queryByLabelText("Close tab")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <BrowserTabs
        tabs={tabs}
        activeId="a"
        onActivate={vi.fn()}
        className="my-tabs"
      />,
    );
    expect(container.querySelector(".my-tabs")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(
      <BrowserTabs tabs={tabs} activeId="a" onActivate={vi.fn()} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
