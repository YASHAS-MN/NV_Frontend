import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SignalPill } from "./signal-pill";

type SectionCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  metrics: string[];
  className?: string;
};

export function SectionCard({
  eyebrow,
  title,
  description,
  icon: Icon,
  metrics,
  className,
}: SectionCardProps) {
  return (
    <article
      className={cn(
        "glass-panel panel-grid group relative overflow-hidden rounded-[28px] p-6 transition duration-300 hover:-translate-y-1 hover:border-nebula-accent/30 hover:shadow-halo",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-nebula-accent/10 via-transparent to-nebula-signal/10 opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <SignalPill tone="accent">{eyebrow}</SignalPill>
            <div>
              <h3 className="text-2xl font-semibold text-white">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-7 text-nebula-muted">
                {description}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-nebula-signal">
            <Icon className="size-6" />
          </div>
        </div>
        <div className="mt-auto grid gap-3">
          {metrics.map((metric) => (
            <div
              key={metric}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/80"
            >
              <span>{metric}</span>
              <ArrowUpRight className="size-4 text-nebula-accent" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
