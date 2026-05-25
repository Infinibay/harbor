import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface ProseProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "max-w-[54ch] text-[14px] leading-[1.7]",
  md: "max-w-[66ch] text-[15px] leading-[1.75]",
  lg: "max-w-[72ch] text-[16px] leading-[1.8]",
};

/** Readable typographic container.
 *
 * Constrains line-length for comfortable reading (~55-75 characters per
 * line), applies nice spacing between elements, and styles inline markup
 * for long-form content. Wrap your article body in this.
 */
export function Prose({ children, size = "md", className }: ProseProps) {
  return (
    <div
      className={cn(
        "mx-auto text-[rgb(var(--harbor-text-muted))]",
        sizes[size],
        // Children spacing
        "[&>*+*]:mt-[1em]",
        "[&>h1]:text-[2em] [&>h1]:font-bold [&>h1]:text-[rgb(var(--harbor-text))] [&>h1]:tracking-tight [&>h1]:leading-[1.2]",
        "[&>h2]:text-[1.45em] [&>h2]:font-semibold [&>h2]:text-[rgb(var(--harbor-text))] [&>h2]:tracking-tight [&>h2]:mt-[1.6em] [&>h2]:mb-[0.4em]",
        "[&>h3]:text-[1.2em] [&>h3]:font-semibold [&>h3]:text-[rgb(var(--harbor-text))] [&>h3]:tracking-tight [&>h3]:mt-[1.4em] [&>h3]:mb-[0.3em]",
        "[&>p]:text-[rgb(var(--harbor-text-muted))]",
        "[&>p>a]:text-[rgb(var(--harbor-accent))] [&>p>a]:underline [&>p>a]:underline-offset-2 [&>p>a:hover]:text-[rgb(var(--harbor-accent-2))]",
        "[&>p>strong]:text-[rgb(var(--harbor-text))] [&>p>strong]:font-semibold",
        "[&>p>em]:italic",
        "[&>p>code]:bg-[var(--harbor-state-hover)] [&>p>code]:text-[rgb(var(--harbor-accent))] [&>p>code]:px-1 [&>p>code]:py-0.5 [&>p>code]:rounded [&>p>code]:font-mono [&>p>code]:text-[0.9em]",
        "[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:marker:text-[rgb(var(--harbor-text-subtle))]",
        "[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:marker:text-[rgb(var(--harbor-text-subtle))]",
        "[&>ul>li+li]:mt-1 [&>ol>li+li]:mt-1",
        "[&>blockquote]:border-l-2 [&>blockquote]:border-[color:var(--harbor-border-focus)] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-[rgb(var(--harbor-text-muted))]",
        "[&>hr]:border-[color:var(--harbor-overlay-border)] [&>hr]:my-8",
        "[&>pre]:bg-[var(--harbor-surface-sunken)] [&>pre]:border [&>pre]:border-[color:var(--harbor-overlay-border)] [&>pre]:text-[rgb(var(--harbor-text))] [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:overflow-auto [&>pre]:font-mono [&>pre]:text-[0.875em]",
        className,
      )}
    >
      {children}
    </div>
  );
}
