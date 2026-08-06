"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BarChart3,
  Code2,
  FileText,
  Flame,
  Layers3,
  Palette,
  Presentation,
  Rocket,
  Shapes,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";

const classes = [
  {
    title: "Code",
    icon: Code2,
    note: "Scripts, frameworks, automation packs",
    momentum: "+22%",
    feature: "Repeat demand from developers and tool builders",
  },
  {
    title: "Digital Art",
    icon: Palette,
    note: "Concept art, 3D assets, visual packs",
    momentum: "+14%",
    feature: "Strong boost activity and bundle visibility",
  },
  {
    title: "Graphics",
    icon: Shapes,
    note: "Brand kits, UI kits, social visuals",
    momentum: "+17%",
    feature: "High repeat purchase rate",
  },
  {
    title: "Applications",
    icon: Rocket,
    note: "Deployed tools, utilities, desktop apps",
    momentum: "+26%",
    feature: "Fastest growth in paid demand",
  },
  {
    title: "Documents",
    icon: FileText,
    note: "Reports, PDFs, structured knowledge",
    momentum: "+9%",
    feature: "Long-tail discovery through trust signals",
  },
  {
    title: "Presentations",
    icon: Presentation,
    note: "Decks, pitch packs, visual docs",
    momentum: "+19%",
    feature: "High visibility from custom requirement delivery",
  },
];

const movers = [
  {
    title: "Autonomous QA toolkit",
    category: "Code",
    trend: "+31%",
    score: "9.4",
    driver: "Review score + repeat buys",
  },
  {
    title: "Modular pitch deck system",
    category: "Presentations",
    trend: "+24%",
    score: "8.9",
    driver: "Custom request conversions",
  },
  {
    title: "Brand launch visual kit",
    category: "Graphics",
    trend: "+21%",
    score: "8.6",
    driver: "Boosted by peer demand",
  },
];

const rankingSignals = [
  "Review quality and repeat buyer confidence",
  "Transaction velocity across recent blocks",
  "Fresh demand spikes and peer discussion activity",
  "Category recency plus conversion from custom requests",
];

export function TrendsPage() {
  const [activeClass, setActiveClass] = useState(classes[0].title);

  const activeCategory = useMemo(
    () => classes.find((item) => item.title === activeClass) ?? classes[0],
    [activeClass],
  );

  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1880px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="glass-panel rounded-[38px] p-6 sm:p-8">
            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,12,31,0.94),rgba(11,12,22,0.92))] p-6 sm:p-8">
                <SignalPill tone="accent">Trends engine</SignalPill>
                <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                  Category momentum and trust-weighted discovery for NEBULAverse.
                </h1>
                <p className="mt-4 max-w-3xl text-sm leading-8 text-nebula-muted">
                  TRENDS is where buyers discover what is rising fastest across the network.
                  The page is designed around ranking logic, category movement, and product confidence.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <TrendStat label="Top rising class" value="Applications" icon={Rocket} />
                  <TrendStat label="Most trusted" value="Code tools" icon={Star} />
                  <TrendStat label="Hot signal" value="Review velocity" icon={Flame} />
                </div>
              </div>

              <div className="glass-panel rounded-[34px] p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <SignalPill tone="success">Ranking logic</SignalPill>
                    <h2 className="mt-4 text-3xl font-semibold text-white">
                      Why something trends
                    </h2>
                  </div>
                  <div className="rounded-3xl border border-nebula-accent/20 bg-nebula-accent/10 p-3 text-nebula-accent">
                    <BarChart3 className="size-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-3">
                  {rankingSignals.map((signal) => (
                    <div
                      key={signal}
                      className="rounded-[24px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-white/76"
                    >
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[36px] p-6 sm:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <SignalPill tone="accent">Category explorer</SignalPill>
                <h2 className="mt-4 text-4xl font-semibold text-white">
                  Explore ranking by product class
                </h2>
              </div>
              <div className="rounded-[26px] border border-white/10 bg-black/20 px-5 py-4 text-sm leading-7 text-white/72">
                Current class:
                <div className="mt-2 text-lg font-medium text-white">{activeCategory.title}</div>
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {classes.map((item) => {
                const Icon = item.icon;
                const isActive = item.title === activeClass;

                return (
                  <button
                    key={item.title}
                    onClick={() => setActiveClass(item.title)}
                    className={cn(
                      "group rounded-[32px] border p-6 text-left transition duration-300 hover:-translate-y-1",
                      isActive
                        ? "border-nebula-accent/28 bg-[linear-gradient(180deg,rgba(28,17,40,0.96),rgba(12,12,22,0.95))]"
                        : "border-white/10 bg-[linear-gradient(180deg,rgba(17,11,29,0.88),rgba(8,9,18,0.92))] hover:border-nebula-accent/18",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-3 text-nebula-accent">
                        <Icon className="size-6" />
                      </div>
                      <div className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white/56">
                        {item.momentum}
                      </div>
                    </div>
                    <h3 className="mt-8 text-2xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-nebula-muted">{item.note}</p>
                    <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/76">
                      {item.feature}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm text-white/74 group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                      Open ranked view
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="glass-panel rounded-[36px] p-6 sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <SignalPill tone="success">Trending movers</SignalPill>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    Products currently pulling attention
                  </h2>
                </div>
                <div className="rounded-3xl border border-nebula-accent/20 bg-nebula-accent/10 p-3 text-nebula-accent">
                  <TrendingUp className="size-6" />
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {movers.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[28px] border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <SignalPill tone="accent">{item.category}</SignalPill>
                          <SignalPill tone="warning">Trending mover</SignalPill>
                        </div>
                        <h3 className="mt-4 text-2xl font-semibold text-white">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-nebula-muted">{item.driver}</p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/5 px-5 py-4 text-right">
                        <div className="text-xs uppercase tracking-[0.24em] text-white/46">Momentum</div>
                        <div className="mt-2 text-2xl font-semibold text-white">{item.trend}</div>
                        <div className="mt-2 text-sm text-nebula-muted">Score {item.score}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
              className="glass-panel rounded-[36px] p-6 sm:p-8"
            >
              <SignalPill tone="accent">Active category view</SignalPill>
              <h2 className="mt-4 text-3xl font-semibold text-white">
                {activeCategory.title} ranking surface
              </h2>
              <div className="mt-6 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(28,17,40,0.96),rgba(12,12,22,0.95))] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-white/46">
                      Momentum
                    </div>
                    <div className="mt-2 text-4xl font-semibold text-white">
                      {activeCategory.momentum}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-nebula-accent/20 bg-nebula-accent/10 p-3 text-nebula-accent">
                    <Layers3 className="size-6" />
                  </div>
                </div>
                <p className="mt-6 text-sm leading-8 text-nebula-muted">
                  {activeCategory.feature}
                </p>
                <div className="mt-8 grid gap-3">
                  <CategoryLine label="Review quality" value="High" />
                  <CategoryLine label="Repeat demand" value="Strong" />
                  <CategoryLine label="Trend confidence" value="Rising" />
                </div>
              </div>
            </motion.section>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

function TrendStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Sparkles;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 px-4 py-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
        <Icon className="size-4 text-nebula-accent" />
        <span>{label}</span>
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}

function CategoryLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm">
      <span className="text-white/70">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
