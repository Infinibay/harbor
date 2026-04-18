import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Avatar } from "./Avatar";
import { Tag } from "./Tag";

export interface ArticleCardProps {
  title: ReactNode;
  excerpt?: ReactNode;
  cover?: string;
  href?: string;
  onClick?: () => void;
  author?: { name: string; avatar?: string };
  date?: string;
  readTime?: string;
  tags?: string[];
  layout?: "stacked" | "horizontal";
  className?: string;
}

export function ArticleCard({
  title,
  excerpt,
  cover,
  href,
  onClick,
  author,
  date,
  readTime,
  tags,
  layout = "stacked",
  className,
}: ArticleCardProps) {
  const Tag_ = href ? "a" : "div";
  return (
    <Tag_
      href={href}
      onClick={onClick}
      data-cursor="button"
      className={cn(
        "group block rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-white/20 hover:bg-white/[0.05] transition-colors",
        layout === "horizontal" && "grid grid-cols-[160px_1fr] gap-0",
        (href || onClick) && "cursor-pointer",
        className,
      )}
    >
      {cover ? (
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "stacked" ? "aspect-[16/9]" : "h-full",
          )}
        >
          <img
            src={cover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      ) : null}
      <div className="p-5 flex flex-col gap-3">
        {tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        ) : null}
        <h3 className="text-white font-semibold text-lg leading-snug tracking-tight group-hover:text-white">
          {title}
        </h3>
        {excerpt ? (
          <p className="text-sm text-white/60 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        ) : null}
        {author || date || readTime ? (
          <div className="flex items-center gap-2.5 mt-1 pt-3 border-t border-white/5 text-xs text-white/50">
            {author ? (
              <>
                <Avatar name={author.name} size="sm" />
                <span className="text-white/75">{author.name}</span>
              </>
            ) : null}
            {date ? (
              <>
                <span className="text-white/25">·</span>
                <span>{date}</span>
              </>
            ) : null}
            {readTime ? (
              <>
                <span className="text-white/25">·</span>
                <span>{readTime}</span>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </Tag_>
  );
}
