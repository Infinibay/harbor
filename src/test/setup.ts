import "@testing-library/jest-dom/vitest";
import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

afterEach(() => {
  cleanup();
});

// jsdom is missing a few APIs that Harbor components reach for.
// Shim the common ones so tests don't need to do it individually.

if (typeof window !== "undefined") {
  // matchMedia — used by HarborProvider (prefers-color-scheme) and the
  // useAnimationFrame hook (prefers-reduced-motion).
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }

  // IntersectionObserver — used by useAnimationFrame's pauseWhenOutOfView.
  if (!("IntersectionObserver" in window)) {
    class MockIO {
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];
    }
    (window as unknown as { IntersectionObserver: typeof IntersectionObserver })
      .IntersectionObserver = MockIO as unknown as typeof IntersectionObserver;
  }

  // ResizeObserver — used by layout hooks (useContainerSize, etc.).
  if (!("ResizeObserver" in window)) {
    class MockRO {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (window as unknown as { ResizeObserver: typeof ResizeObserver })
      .ResizeObserver = MockRO as unknown as typeof ResizeObserver;
  }

  // requestAnimationFrame / cancelAnimationFrame — jsdom has these, but
  // make them synchronous-ish so tests don't hang waiting on frame ticks.
  // Keep native behaviour otherwise.
  // (No-op here; only override if a test needs deterministic timing.)

  // scrollTo — jsdom ships a stub that throws "Not implemented". Many
  // overlays / focus-management helpers call it on open, so stub it.
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  Element.prototype.scrollIntoView =
    Element.prototype.scrollIntoView ?? (() => {});
}
