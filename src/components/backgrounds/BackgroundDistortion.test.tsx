import { describe, it, expect } from "vitest";
import { axe } from "jest-axe";
import { renderWithHarbor } from "../../test/renderWithHarbor";
import {
  BackgroundDistortion,
  type DistortionPreset,
} from "./BackgroundDistortion";

const PRESETS: DistortionPreset[] = [
  "scanlines",
  "crt",
  "grain",
  "vhs",
  "pixel-grid",
  "dither",
  "vignette",
  "bloom",
  "interlace",
];

describe("BackgroundDistortion", () => {
  it("renders every preset without throwing", () => {
    for (const preset of PRESETS) {
      const { unmount, container } = renderWithHarbor(
        <BackgroundDistortion preset={preset} intensity={0.5} />,
      );
      expect(container.firstElementChild).toBeTruthy();
      unmount();
    }
  });

  it("is aria-hidden (purely decorative)", () => {
    const { container } = renderWithHarbor(
      <BackgroundDistortion preset="crt" />,
    );
    // The component may render a wrapper with aria-hidden (single-layer
    // presets) or nested divs; at least one element under the root
    // should declare aria-hidden.
    expect(container.querySelector("[aria-hidden]")).not.toBeNull();
  });

  it("is pointer-events-none so it never blocks clicks", () => {
    const { container } = renderWithHarbor(
      <BackgroundDistortion preset="scanlines" />,
    );
    const root = container.querySelector(
      "[aria-hidden]",
    ) as HTMLElement | null;
    expect(root).not.toBeNull();
    expect(root!.className).toMatch(/pointer-events-none/);
  });

  it("passes `tint` through to mono presets", () => {
    const { container } = renderWithHarbor(
      <BackgroundDistortion preset="pixel-grid" tint="#ff0099" />,
    );
    const root = container.querySelector(
      "[aria-hidden]",
    ) as HTMLElement | null;
    // Harbor stringifies to rgba(r,g,b,alpha) in the generated gradient.
    // Use the raw style attribute since jsdom sometimes reports
    // multi-value backgroundImage as an empty string via the parsed API.
    expect(root?.getAttribute("style") ?? "").toMatch(/255,\s*0,\s*153/);
  });

  it("a11y: no violations on any preset", async () => {
    for (const preset of PRESETS) {
      const { container, unmount } = renderWithHarbor(
        <BackgroundDistortion preset={preset} />,
      );
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
