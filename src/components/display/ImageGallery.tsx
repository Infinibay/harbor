import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/cn";
import { formatBytes, formatRelative } from "../../lib/format";

export interface OSImage {
  id: string;
  name: string;
  /** OS slug for icon/coloring (e.g. "ubuntu", "alpine", "nixos", "debian"). */
  os: string;
  /** Version label ("24.04 LTS"). */
  version?: string;
  /** Image size in bytes. */
  size: number;
  lastUsed?: Date | string | number;
  usageCount?: number;
  /** Custom color/background override. */
  color?: string;
  /** Emoji / single-char fallback icon. */
  icon?: string;
  description?: string;
}

export type ImageSort = "recent" | "usage" | "name" | "size";

export interface ImageGalleryProps {
  images: readonly OSImage[];
  onSelect?: (img: OSImage) => void;
  /** Currently-selected image id — enables a "selected" highlight. */
  selectedId?: string;
  /** Minimum card width (px). Default 220. */
  minCardWidth?: number;
  className?: string;
}

const OS_TONE: Record<string, string> = {
  ubuntu: "from-orange-500/20 to-rose-500/10 border-orange-400/30",
  debian: "from-rose-500/20 to-fuchsia-500/10 border-rose-400/30",
  alpine: "from-sky-500/20 to-cyan-500/10 border-sky-400/30",
  nixos: "from-sky-500/20 to-violet-500/10 border-sky-400/30",
  arch: "from-sky-500/20 to-blue-500/10 border-sky-400/30",
  fedora: "from-blue-500/20 to-sky-500/10 border-blue-400/30",
  centos: "from-violet-500/20 to-fuchsia-500/10 border-violet-400/30",
  windows: "from-sky-500/20 to-blue-500/10 border-sky-400/30",
};

/** Grid of OS images with sort controls. Click a card → `onSelect`. */
export function ImageGallery({
  images,
  onSelect,
  selectedId,
  minCardWidth = 220,
  className,
}: ImageGalleryProps) {
  const [sort, setSort] = useState<ImageSort>("recent");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const out = images.filter(
      (i) =>
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.os.toLowerCase().includes(q) ||
        (i.version ?? "").toLowerCase().includes(q),
    );
    const keyed = out.map((i) => ({ i, key: sortKey(i, sort) }));
    keyed.sort((a, b) => {
      if (sort === "name") return (a.key as string).localeCompare(b.key as string);
      return (b.key as number) - (a.key as number);
    });
    return keyed.map(({ i }) => i);
  }, [images, sort, query]);

  return (
    <div className={cn("w-full flex flex-col gap-3", className)}>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search images…"
          className="flex-1 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-sm text-white outline-none focus:border-fuchsia-400/40"
        />
        <SortChips value={sort} onChange={setSort} />
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))` }}
      >
        {filtered.map((img) => {
          const tone = img.color ?? OS_TONE[img.os.toLowerCase()] ?? "from-white/10 to-white/5 border-white/15";
          const selected = selectedId === img.id;
          return (
            <motion.button
              key={img.id}
              onClick={() => onSelect?.(img)}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className={cn(
                "group relative flex flex-col gap-2 items-start p-3 rounded-xl border text-left bg-gradient-to-br",
                tone,
                selected && "ring-2 ring-fuchsia-400/70",
              )}
            >
              <div className="text-2xl w-8 h-8 rounded-md bg-black/40 grid place-items-center">
                {img.icon ?? img.os.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex flex-col gap-0.5 w-full">
                <div className="text-white font-semibold text-sm leading-tight">
                  {img.name}
                </div>
                <div className="text-xs text-white/60">
                  {img.os}
                  {img.version ? ` · ${img.version}` : ""}
                </div>
                {img.description ? (
                  <div className="text-xs text-white/50 line-clamp-2 mt-1">
                    {img.description}
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-3 text-[10px] text-white/50 tabular-nums font-mono mt-auto w-full">
                <span>{formatBytes(img.size)}</span>
                {img.lastUsed ? <span>{formatRelative(img.lastUsed)}</span> : null}
                {img.usageCount !== undefined ? (
                  <span className="ml-auto">{img.usageCount} uses</span>
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div className="text-sm text-white/40 py-10 text-center border border-dashed border-white/10 rounded-xl">
          No images match.
        </div>
      ) : null}
    </div>
  );
}

function sortKey(i: OSImage, sort: ImageSort): string | number {
  if (sort === "name") return i.name;
  if (sort === "size") return i.size;
  if (sort === "usage") return i.usageCount ?? 0;
  const t = i.lastUsed instanceof Date ? i.lastUsed.getTime() : i.lastUsed ? new Date(i.lastUsed).getTime() : 0;
  return t;
}

function SortChips({ value, onChange }: { value: ImageSort; onChange: (v: ImageSort) => void }) {
  const opts: { v: ImageSort; label: string }[] = [
    { v: "recent", label: "Recent" },
    { v: "usage", label: "Most used" },
    { v: "name", label: "Name" },
    { v: "size", label: "Size" },
  ];
  return (
    <div className="inline-flex gap-0.5 p-0.5 rounded-md bg-white/[0.03] border border-white/10 text-[11px]">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            "px-2 py-0.5 rounded",
            value === o.v ? "bg-white/10 text-white" : "text-white/55 hover:text-white",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
