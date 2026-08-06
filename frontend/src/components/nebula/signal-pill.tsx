import { cn } from "@/lib/utils";

type SignalPillProps = {
  children: React.ReactNode;
  tone?: "default" | "accent" | "success" | "warning";
  className?: string;
};

const toneMap: Record<NonNullable<SignalPillProps["tone"]>, string> = {
  default: "border-white/10 bg-white/5 text-white/80",
  accent: "border-nebula-accent/30 bg-nebula-accent/10 text-nebula-accent",
  success: "border-nebula-signal/30 bg-nebula-signal/10 text-nebula-signal",
  warning: "border-nebula-warning/30 bg-nebula-warning/10 text-nebula-warning",
};

export function SignalPill({
  children,
  tone = "default",
  className,
}: SignalPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.24em]",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
