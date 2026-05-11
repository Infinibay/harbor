import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import { Hide, Show } from "./Show";

const originalMatchMedia = window.matchMedia;

function mockMatchMedia(matches: (query: string) => boolean) {
  window.matchMedia = vi.fn((query: string) =>
    ({
      matches: matches(query),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe("Show", () => {
  it("renders when breakpoint conditions match", () => {
    mockMatchMedia((query) => query.includes("min-width: 768px"));

    renderWithHarbor(
      <Show above="md" animate={false}>
        Desktop panel
      </Show>,
    );

    expect(screen.getByText("Desktop panel")).toBeInTheDocument();
  });

  it("uses device, orientation, and touch predicates", () => {
    mockMatchMedia((query) => {
      if (query.includes("min-width: 768px")) return true;
      if (query.includes("min-width: 1024px")) return false;
      if (query.includes("orientation: portrait")) return true;
      if (query.includes("pointer: coarse")) return true;
      return false;
    });

    renderWithHarbor(
      <Show device="tablet" orientation="portrait" touch animate={false}>
        Tablet touch content
      </Show>,
    );

    expect(screen.getByText("Tablet touch content")).toBeInTheDocument();
  });

  it("Hide renders the inverse of the same predicate set", () => {
    mockMatchMedia((query) => {
      if (query.includes("min-width: 1024px")) return true;
      if (query.includes("pointer: coarse")) return false;
      return false;
    });

    renderWithHarbor(
      <Hide device="desktop" touch={false} animate={false}>
        Non desktop fallback
      </Hide>,
    );

    expect(screen.queryByText("Non desktop fallback")).not.toBeInTheDocument();
  });
});
