import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TOC, type TOCItem } from "./TOC";

const items: TOCItem[] = [
  { id: "intro", label: "Introduction" },
  { id: "setup", label: "Setup", level: 2 },
  { id: "config", label: "Configuration", level: 3 },
  { id: "usage", label: "Usage" },
];

describe("TOC", () => {
  it("renders default title 'On this page'", () => {
    renderWithHarbor(<TOC items={items} />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("renders custom title", () => {
    renderWithHarbor(<TOC items={items} title="Contents" />);
    expect(screen.getByText("Contents")).toBeInTheDocument();
  });

  it("renders item labels as links", () => {
    renderWithHarbor(<TOC items={items} />);
    expect(screen.getByText("Introduction")).toBeInTheDocument();
    expect(screen.getByText("Setup")).toBeInTheDocument();
    expect(screen.getByText("Configuration")).toBeInTheDocument();
    expect(screen.getByText("Usage")).toBeInTheDocument();
  });

  it("renders links with correct href", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const links = container.querySelectorAll("a");
    expect(links[0].getAttribute("href")).toBe("#intro");
    expect(links[1].getAttribute("href")).toBe("#setup");
    expect(links[2].getAttribute("href")).toBe("#config");
  });

  it("renders as nav with aria-label", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const nav = container.querySelector("nav");
    expect(nav).toBeTruthy();
    expect(nav?.getAttribute("aria-label")).toBe("Table of contents");
  });

  it("renders items in a list", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const list = container.querySelector("ul");
    expect(list).toBeTruthy();
    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBe(4);
  });

  it("applies level-2 padding class", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const setupLink = screen.getByText("Setup").closest("a");
    expect(setupLink?.className).toContain("pl-5");
  });

  it("applies level-3 padding class", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const configLink = screen.getByText("Configuration").closest("a");
    expect(configLink?.className).toContain("pl-7");
  });

  it("applies sticky class", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("sticky");
  });

  it("renders border-l on the list", () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    const list = container.querySelector("ul");
    expect(list?.className).toContain("border-l");
  });

  it("renders empty items gracefully", () => {
    const { container } = renderWithHarbor(<TOC items={[]} />);
    expect(container.querySelector("ul")).toBeTruthy();
    expect(container.textContent).toContain("On this page");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <TOC items={items} className="my-toc" />,
    );
    expect(container.querySelector(".my-toc")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<TOC items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
