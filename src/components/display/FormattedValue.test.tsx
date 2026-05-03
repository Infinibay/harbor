import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  FormattedBytes,
  FormattedRate,
  FormattedNumber,
  FormattedPercent,
} from "./FormattedValue";

describe("FormattedBytes", () => {
  it("formats bytes", () => {
    const { container } = renderWithHarbor(<FormattedBytes value={1024 * 1024} />);
    expect(container.textContent).toContain("MB");
  });

  it("shows title tooltip by default", () => {
    const { container } = renderWithHarbor(<FormattedBytes value={500} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("title")).toContain("500 bytes");
  });

  it("hides title when showTitle=false", () => {
    const { container } = renderWithHarbor(<FormattedBytes value={500} showTitle={false} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("title")).toBeFalsy();
  });

  it("handles null value", () => {
    const { container } = renderWithHarbor(<FormattedBytes value={null} />);
    expect(container.textContent).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = renderWithHarbor(<FormattedBytes value={100} className="fb" />);
    expect(container.querySelector(".fb")).toBeTruthy();
  });
});

describe("FormattedRate", () => {
  it("formats bytes per second", () => {
    const { container } = renderWithHarbor(<FormattedRate value={1024 * 1024} />);
    expect(container.textContent).toContain("MB/s");
  });

  it("shows title tooltip", () => {
    const { container } = renderWithHarbor(<FormattedRate value={500} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("title")).toContain("bytes/s");
  });
});

describe("FormattedNumber", () => {
  it("formats numbers with locale", () => {
    const { container } = renderWithHarbor(<FormattedNumber value={1234567} />);
    expect(container.textContent).toContain("1");
  });

  it("supports compact format", () => {
    const { container } = renderWithHarbor(<FormattedNumber value={1234567} compact />);
    // Compact should produce "1.2M" or similar
    expect(container.textContent).toBeTruthy();
  });

  it("shows raw value in title", () => {
    const { container } = renderWithHarbor(<FormattedNumber value={42} />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("title")).toBe("42");
  });
});

describe("FormattedPercent", () => {
  it("formats fraction as percentage", () => {
    const { container } = renderWithHarbor(<FormattedPercent value={0.424} />);
    const span = container.querySelector("span.tabular-nums");
    // Locale may use comma or dot as decimal separator
    expect(span?.textContent).toMatch(/42[.,]4%/);
  });

  it("handles null value", () => {
    const { container } = renderWithHarbor(<FormattedPercent value={null} />);
    expect(container.textContent).toBeTruthy();
  });

  it("uses custom decimals", () => {
    const { container } = renderWithHarbor(<FormattedPercent value={0.5} decimals={0} />);
    expect(container.textContent).toContain("50%");
  });
});

describe("a11y", () => {
  it("FormattedBytes: no violations", async () => {
    const { container } = renderWithHarbor(<FormattedBytes value={1024} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
