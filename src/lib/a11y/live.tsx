import { useCallback, useState, type HTMLAttributes } from "react";
import { cn } from "../cn";

export type LiveRegionPoliteness = "polite" | "assertive" | "off";

export interface LiveRegionProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
  politeness?: LiveRegionPoliteness;
  atomic?: boolean;
  visuallyHidden?: boolean;
}

export function LiveRegion({
  message,
  politeness = "polite",
  atomic = true,
  visuallyHidden = true,
  className,
  ...props
}: LiveRegionProps) {
  return (
    <div
      role={politeness === "assertive" ? "alert" : "status"}
      aria-live={politeness}
      aria-atomic={atomic}
      className={cn(visuallyHidden && "sr-only", className)}
      {...props}
    >
      {message}
    </div>
  );
}

export function useLiveRegion(initialMessage = "") {
  const [message, setMessage] = useState(initialMessage);
  const announce = useCallback((nextMessage: string) => {
    setMessage("");
    window.setTimeout(() => setMessage(nextMessage), 0);
  }, []);
  const clear = useCallback(() => setMessage(""), []);

  return { message, announce, clear };
}
