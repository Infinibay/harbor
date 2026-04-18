/**
 * Export helpers for Canvas viewports.
 *
 * Design: stay dep-free (Harbor's principle). SVG export is lossy on
 * purpose — it walks the DOM for every `[data-canvas-bounds]` and emits
 * a faithful *geometric* copy (rect + fill + stroke + border-radius +
 * transform) using the element's computed styles. That's good enough
 * for most dashboards, node editors and layout tools.
 *
 * For pixel-perfect rasterization (shadows, gradients, images, text),
 * pass an `htmlToImage` adapter — then you can install the user-land
 * `html-to-image` package and get it exactly matched, with Harbor itself
 * staying dep-free.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExportOptions {
  /** World-space region to export. Defaults to the bbox of every
   *  `[data-canvas-bounds]` descendant. */
  bounds?: Rect;
  /** Extra world-unit padding around `bounds`. Default 24. */
  padding?: number;
  /** Background color (any CSS color). Default transparent. */
  background?: string;
  /** Override the default item renderer. */
  itemToSVG?: ItemRenderer;
}

export type ItemRenderer = (
  element: HTMLElement,
  rect: Rect,
) => string | null;

export interface PNGOptions extends ExportOptions {
  /** Device-pixel scale. 2 = retina. Default 2. */
  scale?: number;
  /** Optional pixel-perfect rasterizer. Signature matches
   *  `html-to-image`'s `toBlob`. When provided, it's used instead of
   *  the native SVG→canvas pipeline. */
  htmlToImage?: (node: HTMLElement, opts?: { backgroundColor?: string; pixelRatio?: number }) => Promise<Blob | null>;
}

// =====================================================================
// Internals
// =====================================================================

function collectItems(viewportEl: HTMLElement): {
  el: HTMLElement;
  x: number;
  y: number;
  width: number;
  height: number;
}[] {
  const els = viewportEl.querySelectorAll<HTMLElement>("[data-canvas-bounds]");
  const out: { el: HTMLElement; x: number; y: number; width: number; height: number }[] = [];
  els.forEach((el) => {
    out.push({
      el,
      x: parseFloat(el.dataset.canvasX ?? "0"),
      y: parseFloat(el.dataset.canvasY ?? "0"),
      width: el.offsetWidth,
      height: el.offsetHeight,
    });
  });
  return out;
}

function boundsFromItems(items: ReturnType<typeof collectItems>): Rect | null {
  if (items.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const it of items) {
    if (it.x < minX) minX = it.x;
    if (it.y < minY) minY = it.y;
    if (it.x + it.width > maxX) maxX = it.x + it.width;
    if (it.y + it.height > maxY) maxY = it.y + it.height;
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Default item renderer: walks computed style of the first child (the
 *  visual content) and emits an SVG rect. Covers background, border
 *  color/width, border-radius, opacity, transform (rotate only). */
const defaultItemRenderer: ItemRenderer = (element, rect) => {
  const visual = (element.firstElementChild as HTMLElement) ?? element;
  const cs = window.getComputedStyle(visual);
  const fill = cs.backgroundColor || "transparent";
  const stroke = cs.borderTopColor || "transparent";
  const strokeWidth = parseFloat(cs.borderTopWidth || "0");
  const radius = parseFloat(cs.borderTopLeftRadius || "0");
  const opacity = cs.opacity;
  const text = (visual.textContent ?? "").trim();

  const parts: string[] = [];
  parts.push(
    `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" rx="${radius}" ry="${radius}" fill="${escapeXml(fill)}" stroke="${escapeXml(stroke)}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`,
  );
  if (text) {
    const fontSize = parseFloat(cs.fontSize || "14");
    const color = cs.color || "#fff";
    // Approximate centering — mostly a hint, not precise.
    parts.push(
      `<text x="${rect.x + rect.width / 2}" y="${rect.y + rect.height / 2}" dominant-baseline="middle" text-anchor="middle" fill="${escapeXml(color)}" font-family="${escapeXml(cs.fontFamily || "system-ui")}" font-size="${fontSize}" font-weight="${cs.fontWeight || "400"}">${escapeXml(text)}</text>`,
    );
  }
  return parts.join("");
};

// =====================================================================
// Public: SVG
// =====================================================================

/** Walk the Canvas viewport and return an SVG document string. Every
 *  `[data-canvas-bounds]` descendant is serialized via `itemToSVG`. */
export function exportAsSVG(
  viewportEl: HTMLElement,
  options: ExportOptions = {},
): string {
  const items = collectItems(viewportEl);
  const bounds = options.bounds ?? boundsFromItems(items);
  if (!bounds) {
    // Empty canvas — return a minimal SVG at the viewport size.
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${viewportEl.clientWidth}" height="${viewportEl.clientHeight}"/>`;
  }
  const padding = options.padding ?? 24;
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;
  const renderer = options.itemToSVG ?? defaultItemRenderer;

  const body: string[] = [];
  if (options.background) {
    body.push(
      `<rect x="0" y="0" width="${width}" height="${height}" fill="${escapeXml(options.background)}"/>`,
    );
  }
  for (const it of items) {
    const localRect: Rect = {
      x: it.x - bounds.x + padding,
      y: it.y - bounds.y + padding,
      width: it.width,
      height: it.height,
    };
    const markup = renderer(it.el, localRect);
    if (markup) body.push(markup);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body.join("")}</svg>`;
}

// =====================================================================
// Public: PNG
// =====================================================================

/** Rasterize the viewport to a PNG blob. If `htmlToImage` is provided,
 *  defers to it for pixel-perfect output. Otherwise serializes to SVG
 *  and draws it on a canvas — works everywhere but doesn't pick up
 *  CSS styles from stylesheets (only inline / data-attr-derived). */
export async function exportAsPNG(
  viewportEl: HTMLElement,
  options: PNGOptions = {},
): Promise<Blob> {
  if (options.htmlToImage) {
    const blob = await options.htmlToImage(viewportEl, {
      backgroundColor: options.background,
      pixelRatio: options.scale ?? 2,
    });
    if (!blob) throw new Error("htmlToImage returned null");
    return blob;
  }
  const svg = exportAsSVG(viewportEl, options);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const loaded = new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej(new Error("failed to load SVG as image"));
    });
    img.src = url;
    await loaded;
    const scale = options.scale ?? 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d context unavailable");
    if (options.background) {
      ctx.fillStyle = options.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    return await new Promise<Blob>((res, rej) => {
      canvas.toBlob(
        (b) => (b ? res(b) : rej(new Error("canvas.toBlob returned null"))),
        "image/png",
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

// =====================================================================
// Helpers
// =====================================================================

/** Trigger a browser download of a blob. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Release on the next tick so mobile Safari has time to start the
  // download before the URL is invalidated.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Convenience — `exportAsSVG` + `downloadBlob`. */
export function downloadSVG(
  viewportEl: HTMLElement,
  filename: string,
  options?: ExportOptions,
): void {
  const svg = exportAsSVG(viewportEl, options);
  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), filename);
}

/** Convenience — `exportAsPNG` + `downloadBlob`. */
export async function downloadPNG(
  viewportEl: HTMLElement,
  filename: string,
  options?: PNGOptions,
): Promise<void> {
  const blob = await exportAsPNG(viewportEl, options);
  downloadBlob(blob, filename);
}
