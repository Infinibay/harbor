import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Slider } from "./Slider";
import { NumberField } from "./NumberField";
import { IconTile } from "../display/IconTile";

type Tone = "sky" | "green" | "purple" | "amber" | "rose" | "neutral";

export interface SliderFieldProps {
  value: number;
  min?: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
  /** Icon tile tone. Also colors the leading icon when `icon` is given. */
  tone?: Tone;
  icon?: ReactNode;
  /** When provided, clamps the effective max and shows a hint beneath
   *  the slider (e.g. "Max available: 32 cores"). */
  limit?: number;
  limitLabel?: string;
  className?: string;
}

/** Slider + NumberField in one control, with optional leading icon tile
 *  and a textual limit hint. Use for any labeled range input where the
 *  user benefits from both drag and exact entry.
 *
 *   <SliderField value={cores} min={1} max={64} unit="cores"
 *                icon={<Cpu />} tone="sky"
 *                limit={32} limitLabel="Max available"
 *                onChange={setCores} />
 */
export function SliderField({
  value,
  min = 0,
  max,
  step = 1,
  onChange,
  unit,
  tone = "purple",
  icon,
  limit,
  limitLabel,
  className,
}: SliderFieldProps) {
  const effectiveMax = limit !== undefined ? Math.min(max, limit) : max;
  return (
    <div className={cn("flex items-center gap-3 w-full", className)}>
      {icon ? <IconTile icon={icon} tone={tone} size="md" /> : null}
      <div className="flex-1 min-w-0">
        <Slider
          value={value}
          min={min}
          max={effectiveMax}
          step={step}
          onChange={onChange}
          showValue={false}
        />
        {limit !== undefined && limitLabel ? (
          <div className="mt-1 text-xs text-white/40">
            {limitLabel}: {limit}
            {unit ? ` ${unit}` : ""}
          </div>
        ) : null}
      </div>
      <div className="w-28 shrink-0">
        <NumberField
          value={value}
          min={min}
          max={effectiveMax}
          step={step}
          unit={unit}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
