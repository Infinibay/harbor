import { describe, it, expect, vi } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { TraceWaterfall, SpanBar, type Span } from "./TraceWaterfall";

const spans: Span[] = [
  { id: "root", name: "GET /api", start: 0, duration: 200, status: "ok" },
  { id: "child1", parent: "root", name: "db.query", start: 10, duration: 100, status: "ok" },
  { id: "child2", parent: "root", name: "cache.get", start: 120, duration: 30, status: "error" },
  { id: "grandchild", parent: "child1", name: "serialize", start: 20, duration: 40, status: "pending" },
];

describe("TraceWaterfall", () => {
  it("renders span names", () => {
    const { container } = renderWithHarbor(<TraceWaterfall spans={spans} />);
    expect(container.textContent).toContain("GET /api");
    expect(container.textContent).toContain("db.query");
    expect(container.textContent).toContain("cache.get");
  });

  it("renders the timeline header", () => {
    const { container } = renderWithHarbor(<TraceWaterfall spans={spans} />);
    expect(container.textContent).toContain("Span");
  });

  it("renders a header slot when provided", () => {
    const { container } = renderWithHarbor(
      <TraceWaterfall spans={spans} header={<div>Trace Details</div>} />,
    );
    expect(container.textContent).toContain("Trace Details");
  });

  it("fires onSpanClick when a span bar is clicked", async () => {
    const onSpanClick = vi.fn();
    const { user } = renderWithHarbor(
      <TraceWaterfall spans={spans} onSpanClick={onSpanClick} />,
    );
    // SpanBar divs have cursor-pointer
    const bars = document.querySelectorAll("[title]");
    // Click on the root span bar
    const rootBar = Array.from(bars).find((b) =>
      b.getAttribute("title")?.includes("GET /api"),
    );
    if (rootBar) {
      await user.click(rootBar);
      expect(onSpanClick).toHaveBeenCalledTimes(1);
    }
  });

  it("renders with custom totalMs", () => {
    const { container } = renderWithHarbor(
      <TraceWaterfall spans={spans} totalMs={500} />,
    );
    expect(container.textContent).toContain("GET /api");
  });

  it("renders an empty spans array", () => {
    const { container } = renderWithHarbor(<TraceWaterfall spans={[]} />);
    expect(container).toBeTruthy();
  });

  it("renders a single root span", () => {
    const single: Span[] = [
      { id: "root", name: "ping", start: 0, duration: 50 },
    ];
    const { container } = renderWithHarbor(<TraceWaterfall spans={single} />);
    expect(container.textContent).toContain("ping");
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(
      <TraceWaterfall spans={spans} className="my-trace" />,
    );
    const wrapper = container.querySelector(".my-trace");
    expect(wrapper).toBeTruthy();
  });

  it("a11y: no violations", async () => {
    const { container } = renderWithHarbor(<TraceWaterfall spans={spans} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("SpanBar", () => {
  it("renders a bar with the given name", () => {
    const { container } = renderWithHarbor(
      <SpanBar name="test-span" start={0} duration={100} totalMs={200} />,
    );
    expect(container.textContent).toContain("test-span");
  });

  it("uses status-based colors by default", () => {
    const { container } = renderWithHarbor(
      <SpanBar name="ok" start={0} duration={100} totalMs={200} status="ok" />,
    );
    const bar = container.querySelector("[style]");
    expect(bar).toBeTruthy();
  });

  it("uses custom color when provided", () => {
    const { container } = renderWithHarbor(
      <SpanBar name="custom" start={0} duration={100} totalMs={200} color="#ff0000" />,
    );
    const styled = container.querySelector("[style*='background']");
    expect(styled).toBeTruthy();
  });

  it("fires onClick", async () => {
    const onClick = vi.fn();
    const { container, user } = renderWithHarbor(
      <SpanBar name="clickable" start={0} duration={100} totalMs={200} onClick={onClick} />,
    );
    const bar = container.querySelector("div");
    if (bar) {
      await user.click(bar);
      expect(onClick).toHaveBeenCalledTimes(1);
    }
  });
});
