export function cn(
  ...parts: Array<string | false | null | undefined | Record<string, boolean>>
): string {
  const out: string[] = [];
  for (const p of parts) {
    if (!p) continue;
    if (typeof p === "string") {
      out.push(p);
    } else {
      for (const k in p) if (p[k]) out.push(k);
    }
  }
  return out.join(" ");
}
