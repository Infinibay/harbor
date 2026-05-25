import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
    .filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
}

export function focusFirst(root: HTMLElement): boolean {
  const first = getFocusableElements(root)[0] ?? root;
  first.focus();
  return document.activeElement === first;
}

export function trapFocus(root: HTMLElement, event: KeyboardEvent | ReactKeyboardEvent) {
  if (event.key !== "Tab") return;

  const focusable = getFocusableElements(root);
  if (focusable.length === 0) {
    event.preventDefault();
    root.focus();
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;

  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function focusNextMenuItem(root: HTMLElement, direction: 1 | -1) {
  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[role='menuitem']:not([aria-disabled='true'])"),
  );
  if (items.length === 0) return;

  const activeIndex = Math.max(0, items.indexOf(document.activeElement as HTMLElement));
  const next = (activeIndex + direction + items.length) % items.length;
  items[next]?.focus();
}
