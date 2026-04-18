import { useHotkey, type HotkeyOptions } from "../../lib/useHotkey";

export interface CanvasShortcutsProps {
  /** Delete the current selection. */
  onDelete?: () => void;
  /** Duplicate selection (Cmd/Ctrl+D). */
  onDuplicate?: () => void;
  /** Select every item (Cmd/Ctrl+A). */
  onSelectAll?: () => void;
  /** Clear selection (Escape). */
  onEscape?: () => void;
  /** Nudge selection. `dx`/`dy` are in world units; amount is 1 for plain
   *  arrows and 10 for Shift+arrow. */
  onNudge?: (delta: { dx: number; dy: number; big: boolean }) => void;
  /** Undo (Cmd/Ctrl+Z). */
  onUndo?: () => void;
  /** Redo (Cmd/Ctrl+Shift+Z or Cmd/Ctrl+Y). */
  onRedo?: () => void;
  /** Copy / Paste / Cut (Cmd/Ctrl+C / V / X). */
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  /** Z-order (bracket keys). */
  onBringForward?: () => void;
  onSendBackward?: () => void;
  /** Shared hotkey options — scope / enabled / etc. */
  options?: HotkeyOptions;
}

/** Declarative keyboard layer for a canvas. Every prop is optional; only
 *  the ones you pass are bound. Renders nothing — drop it as a sibling
 *  to the Canvas. */
export function CanvasShortcuts({
  onDelete,
  onDuplicate,
  onSelectAll,
  onEscape,
  onNudge,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onCut,
  onBringForward,
  onSendBackward,
  options,
}: CanvasShortcutsProps) {
  useHotkey(
    {
      ...(onDelete ? { delete: onDelete, backspace: onDelete } : {}),
      ...(onDuplicate ? { "mod+d": onDuplicate } : {}),
      ...(onSelectAll ? { "mod+a": onSelectAll } : {}),
      ...(onEscape ? { escape: onEscape } : {}),
      ...(onUndo ? { "mod+z": onUndo } : {}),
      ...(onRedo ? { "mod+shift+z": onRedo, "mod+y": onRedo } : {}),
      ...(onCopy ? { "mod+c": onCopy } : {}),
      ...(onPaste ? { "mod+v": onPaste } : {}),
      ...(onCut ? { "mod+x": onCut } : {}),
      ...(onBringForward ? { "]": onBringForward, "mod+]": onBringForward } : {}),
      ...(onSendBackward ? { "[": onSendBackward, "mod+[": onSendBackward } : {}),
      ...(onNudge
        ? {
            arrowleft: () => onNudge({ dx: -1, dy: 0, big: false }),
            arrowright: () => onNudge({ dx: 1, dy: 0, big: false }),
            arrowup: () => onNudge({ dx: 0, dy: -1, big: false }),
            arrowdown: () => onNudge({ dx: 0, dy: 1, big: false }),
            "shift+arrowleft": () => onNudge({ dx: -10, dy: 0, big: true }),
            "shift+arrowright": () => onNudge({ dx: 10, dy: 0, big: true }),
            "shift+arrowup": () => onNudge({ dx: 0, dy: -10, big: true }),
            "shift+arrowdown": () => onNudge({ dx: 0, dy: 10, big: true }),
          }
        : {}),
    },
    options,
  );
  return null;
}
