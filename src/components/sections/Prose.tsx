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
        "text-white/80 mx-auto",
        sizes[size],
        // Children spacing
        "[&>*+*]:mt-[1em]",
        "[&>h1]:text-[2em] [&>h1]:font-bold [&>h1]:text-white [&>h1]:tracking-tight [&>h1]:leading-[1.2]",
        "[&>h2]:text-[1.45em] [&>h2]:font-semibold [&>h2]:text-white [&>h2]:tracking-tight [&>h2]:mt-[1.6em] [&>h2]:mb-[0.4em]",
        "[&>h3]:text-[1.2em] [&>h3]:font-semibold [&>h3]:text-white [&>h3]:tracking-tight [&>h3]:mt-[1.4em] [&>h3]:mb-[0.3em]",
        "[&>p]:text-white/75",
        "[&>p>a]:text-fuchsia-300 [&>p>a]:underline [&>p>a]:underline-offset-2 [&>p>a:hover]:text-fuchsia-200",
        "[&>p>strong]:text-white [&>p>strong]:font-semibold",
        "[&>p>em]:italic",
        "[&>p>code]:bg-white/8 [&>p>code]:text-fuchsia-200 [&>p>code]:px-1 [&>p>code]:py-0.5 [&>p>code]:rounded [&>p>code]:font-mono [&>p>code]:text-[0.9em]",
        "[&>ul]:list-disc [&>ul]:pl-5 [&>ul]:marker:text-white/30",
        "[&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:marker:text-white/30",
        "[&>ul>li+li]:mt-1 [&>ol>li+li]:mt-1",
        "[&>blockquote]:border-l-2 [&>blockquote]:border-fuchsia-400/50 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-white/70",
        "[&>hr]:border-white/10 [&>hr]:my-8",
        "[&>pre]:bg-black/40 [&>pre]:border [&>pre]:border-white/8 [&>pre]:rounded-lg [&>pre]:p-4 [&>pre]:overflow-auto [&>pre]:font-mono [&>pre]:text-[0.875em]",
        className,
      )}
    >
      {children}
    </div>
  );
}
