import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DismissableLayer,
  LiveRegion,
  RovingFocusGroup,
  prefersReducedMotion,
  reducedMotionTransition,
  useLiveRegion,
  useReducedMotionPreference,
  useRovingFocusItem,
} from "./index";

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>();
  const query = {
    matches,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === "change") listeners.add(listener);
    }),
    removeEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === "change") listeners.delete(listener);
    }),
    addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener);
    }),
    removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener);
    }),
    dispatch(nextMatches: boolean) {
      query.matches = nextMatches;
      const event = { matches: nextMatches } as MediaQueryListEvent;
      for (const listener of listeners) listener(event);
    },
    dispatchEvent: vi.fn(),
  };

  vi.stubGlobal("matchMedia", vi.fn(() => query));
  return query;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a11y primitives", () => {
  it("dismisses layers on Escape and outside pointer down", () => {
    const onDismiss = vi.fn();
    render(
      <DismissableLayer onDismiss={onDismiss}>
        <button type="button">Inside</button>
      </DismissableLayer>,
    );

    fireEvent.pointerDown(screen.getByRole("button", { name: "Inside" }));
    expect(onDismiss).not.toHaveBeenCalled();

    fireEvent.pointerDown(document.body);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("does not dismiss when the pointer is inside an ignored ref", () => {
    const onDismiss = vi.fn();
    function Harness() {
      const triggerRef = { current: null as HTMLButtonElement | null };
      return (
        <>
          <button ref={(node) => { triggerRef.current = node; }} type="button">
            Trigger
          </button>
          <DismissableLayer onDismiss={onDismiss} ignoreRefs={[triggerRef]}>
            Layer
          </DismissableLayer>
        </>
      );
    }

    render(<Harness />);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Trigger" }));

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("renders polite and assertive live regions", () => {
    const { rerender } = render(<LiveRegion message="Saved" />);

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveTextContent("Saved");

    rerender(<LiveRegion message="Failed" politeness="assertive" />);

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    expect(screen.getByRole("alert")).toHaveTextContent("Failed");
  });

  it("announces live region messages through the hook", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useLiveRegion());

    act(() => result.current.announce("Export complete"));
    expect(result.current.message).toBe("");

    act(() => vi.runAllTimers());
    expect(result.current.message).toBe("Export complete");

    act(() => result.current.clear());
    expect(result.current.message).toBe("");
    vi.useRealTimers();
  });

  it("reads and subscribes to reduced motion preference", () => {
    const media = mockMatchMedia(true);

    expect(prefersReducedMotion()).toBe(true);
    expect(reducedMotionTransition("animated", "instant")).toBe("instant");

    const { result } = renderHook(() => useReducedMotionPreference());
    expect(result.current).toBe(true);

    act(() => media.dispatch(false));

    expect(result.current).toBe(false);
  });

  it("provides roving tabindex for composite widgets", () => {
    function Item({ id, children }: { id: string; children: string }) {
      const roving = useRovingFocusItem({ id });
      return (
        <button type="button" {...roving}>
          {children}
        </button>
      );
    }

    render(
      <RovingFocusGroup>
        <Item id="one">One</Item>
        <Item id="two">Two</Item>
        <Item id="three">Three</Item>
      </RovingFocusGroup>,
    );

    const one = screen.getByRole("button", { name: "One" });
    const two = screen.getByRole("button", { name: "Two" });
    const three = screen.getByRole("button", { name: "Three" });

    expect(one).toHaveAttribute("tabindex", "0");
    expect(two).toHaveAttribute("tabindex", "-1");

    one.focus();
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(two).toHaveFocus();
    expect(two).toHaveAttribute("tabindex", "0");

    fireEvent.keyDown(two, { key: "End" });
    expect(three).toHaveFocus();

    fireEvent.keyDown(three, { key: "ArrowRight" });
    expect(one).toHaveFocus();
  });

  it("supports vertical roving focus without looping", () => {
    function Item({ id, children }: { id: string; children: string }) {
      const roving = useRovingFocusItem({ id });
      return (
        <button type="button" {...roving}>
          {children}
        </button>
      );
    }

    render(
      <RovingFocusGroup orientation="vertical" loop={false}>
        <Item id="one">One</Item>
        <Item id="two">Two</Item>
      </RovingFocusGroup>,
    );

    const one = screen.getByRole("button", { name: "One" });
    const two = screen.getByRole("button", { name: "Two" });

    one.focus();
    fireEvent.keyDown(one, { key: "ArrowDown" });
    expect(two).toHaveFocus();

    fireEvent.keyDown(two, { key: "ArrowDown" });
    expect(two).toHaveFocus();
  });
});
