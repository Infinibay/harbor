import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from "react";

export interface UseDismissableLayerOptions {
  ref: RefObject<HTMLElement | null>;
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
  enabled?: boolean;
  onDismiss: () => void;
  dismissOnEscape?: boolean;
  dismissOnPointerDownOutside?: boolean;
}

export function useDismissableLayer({
  ref,
  ignoreRefs = [],
  enabled = true,
  onDismiss,
  dismissOnEscape = true,
  dismissOnPointerDownOutside = true,
}: UseDismissableLayerOptions) {
  useEffect(() => {
    if (!enabled) return;

    function onKeyDown(event: KeyboardEvent) {
      if (dismissOnEscape && event.key === "Escape") {
        onDismiss();
      }
    }

    function onPointerDown(event: PointerEvent) {
      const layer = ref.current;
      if (
        !dismissOnPointerDownOutside ||
        !layer ||
        layer.contains(event.target as Node | null) ||
        ignoreRefs.some((ignoreRef) =>
          ignoreRef.current?.contains(event.target as Node | null),
        )
      ) {
        return;
      }
      onDismiss();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [
    dismissOnEscape,
    dismissOnPointerDownOutside,
    enabled,
    ignoreRefs,
    onDismiss,
    ref,
  ]);
}

export interface DismissableLayerProps
  extends HTMLAttributes<HTMLDivElement> {
  enabled?: boolean;
  ignoreRefs?: Array<RefObject<HTMLElement | null>>;
  onDismiss: () => void;
  dismissOnEscape?: boolean;
  dismissOnPointerDownOutside?: boolean;
}

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
    return;
  }
  ref.current = value;
}

export const DismissableLayer = forwardRef<HTMLDivElement, DismissableLayerProps>(
  function DismissableLayer(
    {
      enabled,
      ignoreRefs,
      onDismiss,
      dismissOnEscape,
      dismissOnPointerDownOutside,
      ...props
    },
    forwardedRef,
  ) {
    const localRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);
    useDismissableLayer({
      ref: localRef,
      ignoreRefs,
      enabled,
      onDismiss,
      dismissOnEscape,
      dismissOnPointerDownOutside,
    });

    return (
      <div
        {...props}
        ref={(node) => {
          localRef.current = node;
          setRef(forwardedRef, node);
        }}
      />
    );
  },
);
