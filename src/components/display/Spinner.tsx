import { cn } from "../../lib/cn";

export function Spinner({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border-2 border-current border-t-transparent animate-spin align-middle",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

export function Dots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current opacity-60"
          style={{
            animation: `dotbounce 1.1s ${i * 0.15}s infinite ease-in-out`,
          }}
        />
      ))}
      <style>{`@keyframes dotbounce {0%,80%,100%{transform:translateY(0);opacity:.3}40%{transform:translateY(-4px);opacity:1}}`}</style>
    </span>
  );
}
