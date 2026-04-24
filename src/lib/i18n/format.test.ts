import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatList,
  formatNumber,
  formatRelative,
} from "./format";

describe("formatNumber", () => {
  it("formats with thousands separators (en)", () => {
    expect(formatNumber(1234567, "en")).toBe("1,234,567");
  });

  it("formats as currency when style=currency", () => {
    const out = formatNumber(19.5, "en", {
      style: "currency",
      currency: "USD",
    });
    expect(out).toMatch(/\$19\.50/);
  });

  it("formats percentages", () => {
    expect(
      formatNumber(0.42, "en", { style: "percent" }),
    ).toBe("42%");
  });
});

describe("formatDate", () => {
  it("formats a Date per locale", () => {
    const d = new Date("2026-03-15T12:00:00Z");
    const out = formatDate(d, "en", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
    expect(out).toMatch(/March/);
    expect(out).toMatch(/2026/);
  });
});

describe("formatRelative", () => {
  it("picks a sensible unit automatically", () => {
    // 30 seconds → "in 30 seconds" (roughly)
    expect(formatRelative(30, "en")).toMatch(/30 second/);
  });

  it("honours forced unit", () => {
    expect(formatRelative(-3, "en", "day")).toMatch(/3 days ago/);
  });

  it("respects numeric=auto for 'now' / 'yesterday'", () => {
    expect(formatRelative(0, "en", "second")).toBe("now");
  });
});

describe("formatList", () => {
  it("joins with Oxford comma by default (en)", () => {
    expect(formatList(["a", "b", "c"], "en")).toBe("a, b, and c");
  });

  it("handles disjunction", () => {
    expect(
      formatList(["a", "b"], "en", { type: "disjunction" }),
    ).toBe("a or b");
  });
});
