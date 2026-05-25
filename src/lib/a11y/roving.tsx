import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type RovingFocusOrientation = "horizontal" | "vertical" | "both";

interface RovingFocusContextValue {
  activeId: string | null;
  orientation: RovingFocusOrientation;
  loop: boolean;
  ids: string[];
  register: (id: string) => () => void;
  move: (from: string, direction: 1 | -1) => void;
  first: () => void;
  last: () => void;
  setActiveId: (id: string) => void;
}

const RovingFocusContext = createContext<RovingFocusContextValue | null>(null);

export interface RovingFocusGroupProps {
  children: ReactNode;
  orientation?: RovingFocusOrientation;
  loop?: boolean;
  defaultActiveId?: string;
}

export function RovingFocusGroup({
  children,
  orientation = "horizontal",
  loop = true,
  defaultActiveId,
}: RovingFocusGroupProps) {
  const [ids, setIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId ?? null);

  const register = useCallback((id: string) => {
    setIds((current) => (current.includes(id) ? current : [...current, id]));
    setActiveId((current) => current ?? id);
    return () => {
      setIds((current) => current.filter((item) => item !== id));
      setActiveId((current) => (current === id ? null : current));
    };
  }, []);

  const focusByIndex = useCallback(
    (index: number) => {
      const id = ids[index];
      if (!id) return;
      setActiveId(id);
      document.querySelector<HTMLElement>(`[data-harbor-roving-id="${cssEscape(id)}"]`)?.focus();
    },
    [ids],
  );

  const move = useCallback(
    (from: string, direction: 1 | -1) => {
      const index = ids.indexOf(from);
      if (index < 0) return;
      const next = index + direction;
      if (next < 0) {
        if (loop) focusByIndex(ids.length - 1);
        return;
      }
      if (next >= ids.length) {
        if (loop) focusByIndex(0);
        return;
      }
      focusByIndex(next);
    },
    [focusByIndex, ids, loop],
  );

  const value = useMemo<RovingFocusContextValue>(
    () => ({
      activeId,
      orientation,
      loop,
      ids,
      register,
      move,
      first: () => focusByIndex(0),
      last: () => focusByIndex(ids.length - 1),
      setActiveId,
    }),
    [activeId, focusByIndex, ids, loop, move, orientation, register],
  );

  return (
    <RovingFocusContext.Provider value={value}>
      {children}
    </RovingFocusContext.Provider>
  );
}

export interface RovingFocusItemProps {
  id?: string;
  disabled?: boolean;
}

export function useRovingFocusItem({
  id: providedId,
  disabled = false,
}: RovingFocusItemProps = {}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const ctx = useContext(RovingFocusContext);

  if (!ctx) {
    throw new Error("useRovingFocusItem must be used inside <RovingFocusGroup>.");
  }

  const context = ctx;
  const register = context.register;
  useEffect(() => {
    if (disabled) return undefined;
    return register(id);
  }, [disabled, id, register]);

  const selected = context.activeId === id;

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (disabled) return;
    const horizontal =
      context.orientation === "horizontal" || context.orientation === "both";
    const vertical =
      context.orientation === "vertical" || context.orientation === "both";

    if (horizontal && event.key === "ArrowRight") {
      event.preventDefault();
      context.move(id, 1);
    } else if (horizontal && event.key === "ArrowLeft") {
      event.preventDefault();
      context.move(id, -1);
    } else if (vertical && event.key === "ArrowDown") {
      event.preventDefault();
      context.move(id, 1);
    } else if (vertical && event.key === "ArrowUp") {
      event.preventDefault();
      context.move(id, -1);
    } else if (event.key === "Home") {
      event.preventDefault();
      context.first();
    } else if (event.key === "End") {
      event.preventDefault();
      context.last();
    }
  }

  return {
    id,
    selected,
    tabIndex: selected || context.activeId == null ? 0 : -1,
    "data-harbor-roving-id": id,
    onFocus: () => {
      if (!disabled) context.setActiveId(id);
    },
    onKeyDown,
  } as const;
}

function cssEscape(s: string): string {
  return s.replace(/(["\\])/g, "\\$1");
}
