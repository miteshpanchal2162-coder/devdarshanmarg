import { cn } from "@/lib/utils";

type PlaceholderCardProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
  children?: React.ReactNode;
};

export function PlaceholderCard({
  eyebrow,
  title,
  description,
  className,
  children,
}: PlaceholderCardProps) {
  return (
    <div
      className={cn(
        "shadow-premium w-full max-w-lg rounded-2xl border border-border/60 bg-card/80 p-8 backdrop-blur-sm",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  );
}
