import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Container } from "./Container";
import { ResponsiveStack } from "./ResponsiveStack";

type Size = "sm" | "md" | "lg" | "xl" | "2xl" | "prose" | "full";
type Gap = "none" | "sm" | "md" | "lg" | "xl";

const gapScale: Record<Gap, number> = {
  none: 0,
  sm: 3,
  md: 5,
  lg: 6,
  xl: 8,
};

export interface PageProps {
  children: ReactNode;
  /** Max-width of the page content. Maps to `Container.size`. */
  size?: Size;
  /** Vertical gap between direct children. */
  gap?: Gap;
  /** Apply breakpoint-aware horizontal padding. Defaults to true. */
  padded?: boolean;
  className?: string;
}

/** Common page chrome: centered container + vertical stack of sections.
 *
 * Replaces the recurring pattern
 *   <Container size="xl" padded>
 *     <ResponsiveStack direction="col" gap={6}>…</ResponsiveStack>
 *   </Container>
 * with
 *   <Page size="xl" gap="lg">…</Page>
 */
export function Page({
  children,
  size = "xl",
  gap = "lg",
  padded = true,
  className,
}: PageProps) {
  return (
    <Container
      size={size}
      padded={padded}
      className={cn("py-6 md:py-8", className)}
    >
      <ResponsiveStack direction="col" gap={gapScale[gap]}>
        {children}
      </ResponsiveStack>
    </Container>
  );
}
