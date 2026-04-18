import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export interface MarqueeProps {
  children: ReactNode;
  /** Scroll speed in pixels / second. */
  speed?: number;
  /** Direction of travel (for horizontal: "left" or "right"; vertical: "up"/"down"). */
  direction?: "left" | "right" | "up" | "down";
  pauseOnHover?: boolean;
  /** Gap between repeated copies, in pixels. */
  gap?: number;
  /** Edge fade-out mask. */
  fade?: boolean;
  className?: string;
  /** Class applied to each child's wrapper (useful for `shrink-0`/sizing tweaks). */
  itemClassName?: string;
}

/** Infinite-scrolling ribbon. Measures the size of one copy of the
 *  children, duplicates enough copies to cover the wrapper, then
 *  translates via a CSS animation — so hover-to-pause is a single CSS
 *  state change.
 *
 * Classic uses: logo walls, ticker strips, auto-rotating testimonials. */
export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  gap = 32,
  fade = true,
  className,
  itemClassName,
}: MarqueeProps) {
  const vertical = direction === "up" || direction === "down";
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<HTMLDivElement | null>(null);
  const [groupSize, setGroupSize] = useState(0);
  const [wrapSize, setWrapSize] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const group = groupRef.current;
    if (!wrap || !group) return;
    const measure = () => {
      setGroupSize(vertical ? group.offsetHeight : group.offsetWidth);
      setWrapSize(vertical ? wrap.clientHeight : wrap.clientWidth);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    ro.observe(group);
    return () => ro.disconnect();
  }, [vertical, children]);

  const copies = groupSize > 0
    ? Math.max(2, Math.ceil((wrapSize + groupSize) / groupSize) + 1)
    : 2;
  const duration = groupSize > 0 ? groupSize / speed : 20;
  const childArr = Children.toArray(children);

  const animName = vertical ? "harbor-marquee-y" : "harbor-marquee-x";
  const reverse = direction === "right" || direction === "down";

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative overflow-hidden",
        pauseOnHover && "group",
        fade &&
          (vertical
            ? "[mask-image:linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
            : "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"),
        className,
      )}
    >
      <div
        className={cn(
          "flex will-change-transform",
          vertical ? "flex-col" : "flex-row",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
        style={{
          animationName: animName,
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationDirection: reverse ? "reverse" : "normal",
          // @ts-expect-error — custom prop read by the keyframe
          "--harbor-marquee-distance": `-${groupSize}px`,
        }}
      >
        {Array.from({ length: copies }).map((_, copyIdx) => (
          <div
            key={copyIdx}
            ref={copyIdx === 0 ? groupRef : undefined}
            aria-hidden={copyIdx > 0 || undefined}
            className={cn(
              "flex shrink-0",
              vertical ? "flex-col" : "flex-row",
            )}
            style={{ gap, [vertical ? "paddingBottom" : "paddingRight"]: gap }}
          >
            {childArr.map((c, i) => (
              <div key={i} className={cn("shrink-0", itemClassName)}>
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
