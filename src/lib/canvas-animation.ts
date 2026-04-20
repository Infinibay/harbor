import { useCallback, useEffect, useRef, useState } from "react";
import {
  animate,
  type AnimationPlaybackControls,
  type Easing,
  type MotionValue,
} from "framer-motion";

// =====================================================================
// useCanvasTimeline — GSAP-ish sequencer over motion values
// =====================================================================

export interface TimelineStepOpts {
  /** Start time, in seconds from play(). Default 0. */
  at?: number;
  /** Duration, seconds. Default 0.4. */
  duration?: number;
  ease?: Easing | Easing[];
}

export interface CanvasTimelineHandle {
  /** Tween a motion value to `value`. Chains. */
  to<T>(target: MotionValue<T>, value: T, opts?: TimelineStepOpts): CanvasTimelineHandle;
  /** Tween many motion values to a shared value with a stagger. */
  stagger<T>(
    targets: MotionValue<T>[],
    value: T,
    opts?: TimelineStepOpts & { each?: number; from?: number },
  ): CanvasTimelineHandle;
  /** Run an arbitrary callback at a specific timeline time. */
  call(fn: () => void, at?: number): CanvasTimelineHandle;
  /** Wipe all pending steps. */
  reset(): CanvasTimelineHandle;
  /** Execute the timeline. */
  play(): CanvasTimelineHandle;
  /** Cancel any in-flight tweens + pending timers. */
  pause(): void;
  /** Total duration (seconds), based on the furthest `at + duration`. */
  readonly duration: number;
  readonly isPlaying: boolean;
}

interface TimelineTweenStep {
  kind: "tween";
  target: MotionValue<unknown>;
  value: unknown;
  at: number;
  duration: number;
  ease: Easing | Easing[] | undefined;
}

interface TimelineCallStep {
  kind: "call";
  fn: () => void;
  at: number;
}

type TimelineStep = TimelineTweenStep | TimelineCallStep;

/** Schedules tweens (via Framer Motion `animate`) against motion values
 *  the caller provides. Think of it as a thin GSAP-style conductor:
 *  you add steps with `.to(mv, to, { at, duration })`, chain as many as
 *  you want, then `.play()`.
 *
 *  ```tsx
 *  const x = useMotionValue(0);
 *  const y = useMotionValue(0);
 *  const tl = useCanvasTimeline();
 *
 *  useEffect(() => {
 *    tl.reset()
 *      .to(x, 200, { at: 0, duration: 0.6 })
 *      .to(y, 120, { at: 0.2, duration: 0.6, ease: "easeOut" })
 *      .call(() => console.log("halfway"), 0.4)
 *      .to(x, 0, { at: 1.0 })
 *      .play();
 *  }, [tl, x, y]);
 *  ``` */
export function useCanvasTimeline(): CanvasTimelineHandle {
  const stepsRef = useRef<TimelineStep[]>([]);
  const controlsRef = useRef<AnimationPlaybackControls[]>([]);
  const timersRef = useRef<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  const updateDuration = () => {
    let max = 0;
    for (const s of stepsRef.current) {
      const end = s.at + (s.kind === "tween" ? s.duration : 0);
      if (end > max) max = end;
    }
    setDuration(max);
  };

  const cancelAll = useCallback(() => {
    for (const c of controlsRef.current) c.stop();
    for (const t of timersRef.current) window.clearTimeout(t);
    controlsRef.current = [];
    timersRef.current = [];
  }, []);

  useEffect(() => () => cancelAll(), [cancelAll]);

  const handle = useRef<CanvasTimelineHandle | null>(null);
  if (!handle.current) {
    const api: CanvasTimelineHandle = {
      to(target, value, opts) {
        stepsRef.current.push({
          kind: "tween",
          target: target as MotionValue<unknown>,
          value,
          at: opts?.at ?? 0,
          duration: opts?.duration ?? 0.4,
          ease: opts?.ease,
        });
        updateDuration();
        return api;
      },
      stagger(targets, value, opts) {
        const each = opts?.each ?? 0.05;
        const from = opts?.from ?? opts?.at ?? 0;
        targets.forEach((target, i) => {
          stepsRef.current.push({
            kind: "tween",
            target: target as MotionValue<unknown>,
            value,
            at: from + i * each,
            duration: opts?.duration ?? 0.4,
            ease: opts?.ease,
          });
        });
        updateDuration();
        return api;
      },
      call(fn, at = 0) {
        stepsRef.current.push({ kind: "call", fn, at });
        return api;
      },
      reset() {
        cancelAll();
        stepsRef.current = [];
        setIsPlaying(false);
        setDuration(0);
        return api;
      },
      play() {
        cancelAll();
        setIsPlaying(true);
        for (const step of stepsRef.current) {
          if (step.kind === "tween") {
            const tm = window.setTimeout(() => {
              const c = animate(step.target as MotionValue<number>, step.value as number, {
                duration: step.duration,
                ease: step.ease ?? "easeOut",
              });
              controlsRef.current.push(c);
            }, step.at * 1000);
            timersRef.current.push(tm);
          } else {
            const tm = window.setTimeout(step.fn, step.at * 1000);
            timersRef.current.push(tm);
          }
        }
        const end = window.setTimeout(
          () => setIsPlaying(false),
          duration * 1000 + 16,
        );
        timersRef.current.push(end);
        return api;
      },
      pause() {
        cancelAll();
        setIsPlaying(false);
      },
      get duration() {
        return duration;
      },
      get isPlaying() {
        return isPlaying;
      },
    };
    handle.current = api;
  }

  return handle.current;
}

// =====================================================================
// stagger — utility for coordinated mass animations
// =====================================================================

export interface StaggerOptions {
  /** Per-index delay (seconds). Default 0.05. */
  each?: number;
  /** Absolute offset added to every index. */
  from?: number;
  /**
   * Direction of the cascade:
   *  - `"first"` (default): item 0 goes first
   *  - `"last"`: last item goes first
   *  - `"center"`: items closest to the middle go first
   *  - `"random"`: shuffled
   */
  order?: "first" | "last" | "center" | "random";
}

/** Returns a function that, given an index and the total count, returns
 *  the staggered delay (seconds) for that position.
 *
 *  ```tsx
 *  const delay = stagger({ each: 0.08, order: "center" });
 *  items.map((it, i, arr) => (
 *    <motion.div transition={{ delay: delay(i, arr.length) }} />
 *  ))
 *  ``` */
export function stagger(opts: StaggerOptions = {}): (i: number, total: number) => number {
  const each = opts.each ?? 0.05;
  const from = opts.from ?? 0;
  const order = opts.order ?? "first";
  const shuffle = order === "random" ? new Map<string, number[]>() : null;
  return (i: number, total: number) => {
    if (order === "first") return from + i * each;
    if (order === "last") return from + (total - 1 - i) * each;
    if (order === "center") {
      const mid = (total - 1) / 2;
      return from + Math.abs(i - mid) * each;
    }
    // random — cache per `total` so consecutive calls agree
    const key = String(total);
    let perm = shuffle!.get(key);
    if (!perm) {
      perm = Array.from({ length: total }, (_, k) => k);
      for (let k = perm.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [perm[k], perm[j]] = [perm[j], perm[k]];
      }
      shuffle!.set(key, perm);
    }
    return from + perm[i] * each;
  };
}
