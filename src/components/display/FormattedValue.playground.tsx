import {
  FormattedBytes,
  FormattedRate,
  FormattedNumber,
  FormattedPercent,
} from "./FormattedValue";
import type { PlaygroundManifest } from "../../../../src/harbor/lib/playground";

function FormattedValueDemo() {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm text-white/80" style={{ minWidth: 360 }}>
      <span className="text-white/40">Bytes</span>
      <FormattedBytes value={12_400_000} />
      <span className="text-white/40">Bytes (binary)</span>
      <FormattedBytes value={2 ** 30} binary />
      <span className="text-white/40">Rate</span>
      <FormattedRate value={1_250_000} />
      <span className="text-white/40">Number</span>
      <FormattedNumber value={1_240_000} />
      <span className="text-white/40">Number (compact)</span>
      <FormattedNumber value={1_240_000} compact />
      <span className="text-white/40">Percent</span>
      <FormattedPercent value={0.424} />
    </div>
  );
}

export const playground: PlaygroundManifest = {
  component: FormattedValueDemo as never,
  importPath: "@infinibay/harbor/display",
  controls: {},
  notes:
    "All four components share the same `<span>`-with-tooltip shell — they only differ in which `lib/format` helper drives the output.",
};
