import { useMemo } from "react";
import {
  TimeSeriesChart,
  TimeSeriesMarker,
  type TimeSeries,
  type TimeSeriesPoint,
  type TimeSeriesChartProps,
} from "./TimeSeriesChart";

export interface ResourceForecastProps
  extends Omit<TimeSeriesChartProps, "children"> {
  /** Hard quota to annotate (dashed horizontal? Rendered via a y-line). */
  quota?: number;
  /** Steps to project forward. Default 30. */
  steps?: number;
  /** Step interval in ms — default auto-derived from data cadence. */
  stepMs?: number;
  /** Custom forecast. Default: linear regression over the last
   *  `windowSize` points of each series. */
  forecast?: (series: TimeSeries, steps: number, stepMs: number) => TimeSeriesPoint[];
  /** Points considered for linear regression. Default 10. */
  windowSize?: number;
}

function linearForecast(
  series: TimeSeries,
  steps: number,
  stepMs: number,
  windowSize: number,
): TimeSeriesPoint[] {
  if (series.data.length < 2) return [];
  const tail = series.data.slice(-windowSize);
  // simple linear regression on tail (t in ms)
  const n = tail.length;
  const xs = tail.map((p) => (typeof p.t === "number" ? p.t : p.t.getTime()));
  const ys = tail.map((p) => p.v);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) * (xs[i] - mx);
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = my - slope * mx;
  const lastT = xs[xs.length - 1];
  const out: TimeSeriesPoint[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = lastT + i * stepMs;
    out.push({ t, v: slope * t + intercept });
  }
  return out;
}

function findCrossingTime(
  projection: TimeSeriesPoint[],
  quota: number,
): Date | null {
  for (let i = 0; i < projection.length; i++) {
    if (projection[i].v >= quota) {
      return new Date(typeof projection[i].t === "number" ? projection[i].t : (projection[i].t as Date).getTime());
    }
  }
  return null;
}

/** TimeSeriesChart + a dashed projection past "now". Default forecast is
 *  linear regression over the last `windowSize` points; callers can pass
 *  a custom `forecast` fn to plug in Holt-Winters / Prophet server-side. */
export function ResourceForecast({
  series,
  quota,
  steps = 30,
  stepMs,
  forecast,
  windowSize = 10,
  ...rest
}: ResourceForecastProps) {
  const { combined, crossing } = useMemo(() => {
    const cadence =
      stepMs ??
      (series[0]?.data.length && series[0].data.length >= 2
        ? (() => {
            const a = series[0].data[series[0].data.length - 1];
            const b = series[0].data[series[0].data.length - 2];
            const at = typeof a.t === "number" ? a.t : a.t.getTime();
            const bt = typeof b.t === "number" ? b.t : b.t.getTime();
            return at - bt;
          })()
        : 60_000);
    const out: TimeSeries[] = [];
    let firstCrossing: Date | null = null;
    for (const s of series) {
      const projection = (forecast ?? ((ss, st, sms) => linearForecast(ss, st, sms, windowSize)))(
        s,
        steps,
        cadence,
      );
      out.push(s);
      out.push({
        id: `${s.id}-forecast`,
        label: `${s.label ?? s.id} (forecast)`,
        color: s.color ?? "rgba(168,85,247,0.5)",
        data: projection,
      });
      if (quota !== undefined && !firstCrossing) {
        firstCrossing = findCrossingTime(projection, quota);
      }
    }
    return { combined: out, crossing: firstCrossing };
  }, [series, forecast, steps, stepMs, quota, windowSize]);

  return (
    <TimeSeriesChart {...rest} series={combined}>
      {crossing ? (
        <TimeSeriesMarker
          at={crossing}
          label={`projected quota @ ${quota}`}
          color="#f43f5e"
          stroke="solid"
        />
      ) : null}
    </TimeSeriesChart>
  );
}
