import { useEffect, useMemo, useRef, type RefObject } from "react";

export type HotkeyHandler = (e: KeyboardEvent) => void;
export type HotkeyMap = Record<string, HotkeyHandler>;

export interface HotkeyOptions {
  /** When false, the listener is not attached. Default true. */
  enabled?: boolean;
  /** Attach keydown to this element instead of `window`. Accepts the
   *  element, a React ref, or `null`. */
  scope?: Window | HTMLElement | RefObject<HTMLElement | null> | null;
  /** Don't fire when focus is inside `<input>`, `<textarea>`, `<select>`
   *  or a contenteditable node. Default true. */
  ignoreInputs?: boolean;
  /** Call `e.preventDefault()` on match. Default true — matches GSAP /
   *  Figma expectation that a bound key shouldn't also type. */
  preventDefault?: boolean;
}

// =====================================================================
// Canonical form: `ctrl+meta+shift+alt+<key>`, lowercased. `mod` resolves
// to `meta` on macOS and `ctrl` elsewhere.
// =====================================================================

interface KeyParts {
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  key: string;
}

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/.test(navigator.platform);
}

function canonical(p: KeyParts): string {
  let s = "";
  if (p.ctrl) s += "ctrl+";
  if (p.meta) s += "meta+";
  if (p.shift) s += "shift+";
  if (p.alt) s += "alt+";
  return s + p.key;
}

function parseHotkey(hotkey: string): KeyParts {
  const parts = hotkey
    .toLowerCase()
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean);
  const key = parts[parts.length - 1] ?? "";
  const mods = new Set(parts.slice(0, -1));
  const mac = isMac();
  const out: KeyParts = { ctrl: false, meta: false, shift: false, alt: false, key };
  if (mods.has("mod")) {
    if (mac) out.meta = true;
    else out.ctrl = true;
  }
  if (mods.has("ctrl") || mods.has("control")) out.ctrl = true;
  if (mods.has("cmd") || mods.has("command") || mods.has("meta")) out.meta = true;
  if (mods.has("shift")) out.shift = true;
  if (mods.has("alt") || mods.has("option") || mods.has("opt")) out.alt = true;
  return out;
}

function canonicalFromEvent(e: KeyboardEvent): string {
  return canonical({
    ctrl: e.ctrlKey,
    meta: e.metaKey,
    shift: e.shiftKey,
    alt: e.altKey,
    key: e.key.toLowerCase(),
  });
}

function isInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

// =====================================================================
// Public hook
// =====================================================================

/**
 * Bind keyboard shortcuts declaratively.
 *
 * ```ts
 * useHotkey("mod+d", duplicate);            // Cmd+D (macOS) / Ctrl+D
 * useHotkey("shift+arrowleft", nudge);
 * useHotkey(
 *   {
 *     "mod+z": undo,
 *     "mod+shift+z": redo,
 *     "escape": clear,
 *   },
 *   { scope: canvasRef },
 * );
 * ```
 *
 * Modifiers accepted (case-insensitive, any order): `mod`, `ctrl`,
 * `meta`/`cmd`/`command`, `shift`, `alt`/`option`. Use `mod` when you
 * want "Cmd on Mac, Ctrl on PC" (the common case). Keys use the
 * lowercased `KeyboardEvent.key` name (`escape`, `arrowleft`, `/`, `a`).
 */
export function useHotkey(
  binding: string,
  handler: HotkeyHandler,
  options?: HotkeyOptions,
): void;
export function useHotkey(map: HotkeyMap, options?: HotkeyOptions): void;
export function useHotkey(
  bindingOrMap: string | HotkeyMap,
  handlerOrOptions?: HotkeyHandler | HotkeyOptions,
  maybeOptions?: HotkeyOptions,
): void {
  const isMap = typeof bindingOrMap !== "string";
  const opts = (isMap
    ? (handlerOrOptions as HotkeyOptions | undefined)
    : maybeOptions) ?? {};
  const handler =
    !isMap && typeof handlerOrOptions === "function"
      ? (handlerOrOptions as HotkeyHandler)
      : undefined;

  const { enabled = true, scope, ignoreInputs = true, preventDefault = true } = opts;

  // Parse bindings into a map of canonical → handler. Rebuilt every
  // render (cheap) and stored in a ref so the subscribed listener
  // always sees the latest handlers without resubscribing.
  const bindingsRef = useRef<Map<string, HotkeyHandler>>(new Map());
  useMemo(() => {
    const m = new Map<string, HotkeyHandler>();
    if (isMap) {
      for (const [k, v] of Object.entries(bindingOrMap as HotkeyMap)) {
        m.set(canonical(parseHotkey(k)), v);
      }
    } else if (handler) {
      m.set(canonical(parseHotkey(bindingOrMap as string)), handler);
    }
    bindingsRef.current = m;
  }, [bindingOrMap, handler, isMap]);

  useEffect(() => {
    if (!enabled) return;
    const target: Window | HTMLElement | null = !scope
      ? typeof window !== "undefined"
        ? window
        : null
      : "current" in scope
        ? scope.current
        : (scope as Window | HTMLElement);
    if (!target) return;

    const onKey = (e: Event) => {
      const ev = e as KeyboardEvent;
      if (ignoreInputs && isInputTarget(ev.target)) return;
      const key = canonicalFromEvent(ev);
      const h = bindingsRef.current.get(key);
      if (h) {
        if (preventDefault) ev.preventDefault();
        h(ev);
      }
    };

    (target as Window).addEventListener("keydown", onKey);
    return () => {
      (target as Window).removeEventListener("keydown", onKey);
    };
  }, [enabled, scope, ignoreInputs, preventDefault]);
}
