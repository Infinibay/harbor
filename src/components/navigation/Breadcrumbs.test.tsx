import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

const items: Crumb[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Harbor" },
];

describe("Breadcrumbs", () => {
  it("renders crumb labels", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    expect(container.textContent).toContain("Home");
    expect(container.textContent).toContain("Projects");
    expect(container.textContent).toContain("Harbor");
  });

  it("renders links for items with href", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(3);
    expect(links[0].getAttribute("href")).toBe("/");
    expect(links[1].getAttribute("href")).toBe("/projects");
  });

  it("renders separator › between items", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    // 3 items → 2 separators
    const separators = container.querySelectorAll("span.select-none");
    expect(separators.length).toBe(2);
    expect(separators[0].textContent).toBe("›");
  });

  it("does not render an extra separator after the last item", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    // Separators are emitted BETWEEN items only, so N items should have N-1 separators.
    const sepGlyphSpans = Array.from(container.querySelectorAll("span")).filter(
      (s) => s.textContent === "›",
    );
    const linkCount = container.querySelectorAll("a").length;
    expect(sepGlyphSpans.length).toBe(linkCount - 1);
  });

  it("renders last item with primary text token class", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    const links = container.querySelectorAll("a");
    const lastLink = links[links.length - 1];
    expect(lastLink?.className).toContain("text-[rgb(var(--harbor-text))]");
  });

  it("renders non-last items with muted text token class", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    const links = container.querySelectorAll("a");
    expect(links[0].className).toContain("text-[rgb(var(--harbor-text-muted))]");
  });

  it("renders icon when provided", () => {
    const iconItems: Crumb[] = [
      { label: "Home", icon: <span data-testid="icon">🏠</span> },
    ];
    const { container } = renderWithHarbor(<Breadcrumbs items={iconItems} />);
    expect(container.querySelector("[data-testid='icon']")).toBeTruthy();
  });

  it("renders a single item without separator", () => {
    const { container } = renderWithHarbor(
      <Breadcrumbs items={[{ label: "Only" }]} />,
    );
    const separators = container.querySelectorAll("span.select-none");
    expect(separators.length).toBe(0);
  });

  it("wraps in nav element", () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    expect(container.querySelector("nav")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <Breadcrumbs items={items} className="my-crumb" />,
    );
    expect(container.querySelector(".my-crumb")).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<Breadcrumbs items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
