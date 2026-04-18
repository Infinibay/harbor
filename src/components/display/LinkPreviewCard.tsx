import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface LinkPreviewCardProps {
  url: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  favicon?: string;
  siteName?: ReactNode;
  className?: string;
}

function domainOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function LinkPreviewCard({
  url,
  title,
  description,
  image,
  favicon,
  siteName,
  className,
}: LinkPreviewCardProps) {
  const domain = domainOf(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="button"
      className={cn(
        "group flex rounded-xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-colors",
        className,
      )}
    >
      <div className="flex-1 min-w-0 p-4">
        <div className="flex items-center gap-2 text-xs text-white/55">
          {favicon ? (
            <img src={favicon} alt="" className="w-4 h-4 rounded-sm" />
          ) : (
            <span className="w-4 h-4 rounded-sm bg-white/10 grid place-items-center text-[10px]">
              🌐
            </span>
          )}
          <span className="truncate">{siteName ?? domain}</span>
        </div>
        <div className="text-sm text-white font-medium mt-1 line-clamp-2 group-hover:text-fuchsia-200 transition-colors">
          {title}
        </div>
        {description ? (
          <div className="text-xs text-white/55 mt-1 line-clamp-2 leading-relaxed">
            {description}
          </div>
        ) : null}
        <div className="text-[11px] text-white/35 mt-2 truncate font-mono">
          {url}
        </div>
      </div>
      {image ? (
        <div className="w-28 shrink-0 relative overflow-hidden bg-white/5">
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : null}
    </a>
  );
}
