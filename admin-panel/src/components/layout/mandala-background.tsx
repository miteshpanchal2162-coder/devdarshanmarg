import { cn } from "@/lib/utils";

type MandalaBackgroundProps = {
  className?: string;
};

function MandalaSvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      className={className}
      aria-hidden
    >
      <circle cx="256" cy="256" r="240" stroke="currentColor" strokeWidth="0.75" opacity="0.35" />
      <circle cx="256" cy="256" r="200" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      <circle cx="256" cy="256" r="160" stroke="currentColor" strokeWidth="0.75" opacity="0.25" />
      <circle cx="256" cy="256" r="120" stroke="currentColor" strokeWidth="0.75" opacity="0.2" />
      <circle cx="256" cy="256" r="80" stroke="currentColor" strokeWidth="0.75" opacity="0.15" />
      <g opacity="0.2">
        <path
          d="M256 16 L272 120 L256 136 L240 120 Z M256 496 L272 392 L256 376 L240 392 Z M16 256 L120 272 L136 256 L120 240 Z M496 256 L392 272 L376 256 L392 240 Z"
          fill="currentColor"
        />
        <path
          d="M88 88 L168 168 M424 88 L344 168 M88 424 L168 344 M424 424 L344 344"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </g>
      <g opacity="0.15">
        <path
          d="M256 56 C256 56 320 120 320 256 C320 392 256 456 256 456 C256 456 192 392 192 256 C192 120 256 56 256 56 Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path
          d="M56 256 C56 256 120 192 256 192 C392 192 456 256 456 256 C456 256 392 320 256 320 C120 320 56 256 56 256 Z"
          stroke="currentColor"
          strokeWidth="0.75"
        />
      </g>
    </svg>
  );
}

export function MandalaBackground({ className }: MandalaBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40" />
      <MandalaSvg className="absolute -right-24 -top-24 h-[520px] w-[520px] text-primary/10 dark:text-primary/15" />
      <MandalaSvg className="absolute -bottom-32 -left-32 h-[480px] w-[480px] rotate-45 text-accent/10 dark:text-accent/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_oklch(0.68_0.19_45_/_6%),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_oklch(0.68_0.19_45_/_10%),_transparent_55%)]" />
    </div>
  );
}
