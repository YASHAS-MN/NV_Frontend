"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Clock3,
  FileStack,
  Filter,
  MessageSquare,
  PenTool,
  PlusCircle,
  Repeat2,
  Send,
  Sparkles,
  UserRoundPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { NoticeBanner } from "./shared-notice";
import { SignalPill } from "./signal-pill";
import { SiteChrome } from "./site-chrome";

const requestCategories = [
  "All",
  "Software",
  "Graphics",
  "Digital Art",
  "Documents",
  "Presentations",
  "Mixed Work",
];

const urgencyModes = ["Any urgency", "Hot", "This week", "Flexible"];

const starterRequests = [
  {
    title: "Need a lightweight invoicing dApp for freelancers",
    author: "0xClient_Orbit",
    category: "Software",
    budget: "140 VC",
    urgency: "Hot",
    summary:
      "Escrow-backed billing flow, PDF export, and clean analytics for solo builders.",
    boosts: 18,
    comments: 6,
    stage: "Open",
    timeline: ["Requirement posted", "2 builders interested", "Waiting for claim"],
  },
  {
    title: "Interactive presentation builder for startup demos",
    author: "0xPitchMaker",
    category: "Presentations",
    budget: "96 VC",
    urgency: "This week",
    summary:
      "Need a dynamic deck system with AI-assisted structure and export-ready visuals.",
    boosts: 11,
    comments: 9,
    stage: "Builder discussing",
    timeline: ["Requirement posted", "Peer comments active", "Scope being refined"],
  },
  {
    title: "Custom digital brand kit generator with multilingual output",
    author: "0xStudioFlux",
    category: "Graphics",
    budget: "175 VC",
    urgency: "Flexible",
    summary:
      "Looking for reusable design assets, color systems, and copy templates for multiple markets.",
    boosts: 14,
    comments: 4,
    stage: "Boosted",
    timeline: ["Requirement posted", "Boosted by peers", "Awaiting builder claim"],
  },
  {
    title: "Automated PDF summarizer with code and slide export",
    author: "0xInsightNode",
    category: "Mixed Work",
    budget: "210 VC",
    urgency: "Hot",
    summary:
      "Need document parsing, condensed slide generation, and exportable briefing notes.",
    boosts: 21,
    comments: 12,
    stage: "Open",
    timeline: ["Requirement posted", "4 peers upscaled", "Builder search active"],
  },
];

type ComposerState = {
  title: string;
  category: string;
  budget: string;
  urgency: string;
  details: string;
  milestones: string;
};

export function CustomizePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeUrgency, setActiveUrgency] = useState("Any urgency");
  const [notice, setNotice] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerState>({
    title: "",
    category: "Software",
    budget: "",
    urgency: "Hot",
    details: "",
    milestones: "",
  });

  const filteredRequests = useMemo(
    () =>
      starterRequests.filter((request) => {
        const matchesCategory =
          activeCategory === "All" || request.category === activeCategory;
        const matchesUrgency =
          activeUrgency === "Any urgency" || request.urgency === activeUrgency;
        return matchesCategory && matchesUrgency;
      }),
    [activeCategory, activeUrgency],
  );

  const handlePostRequirement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!composer.title.trim() || !composer.details.trim()) {
      setNotice("Add a title and requirement details before posting.");
      return;
    }

    setNotice(
      "Requirement posted to the peer board. Next step: connect this to a backend request store and discussion thread.",
    );
    setComposer({
      title: "",
      category: "Software",
      budget: "",
      urgency: "Hot",
      details: "",
      milestones: "",
    });
  };

  return (
    <SiteChrome>
      <main className="mx-auto w-full max-w-[1880px] px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        <section className="space-y-6">
          <div className="glass-panel rounded-[38px] p-6 sm:p-8">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(18,12,31,0.92),rgba(10,10,20,0.94))] p-6 sm:p-8">
                <SignalPill tone="accent">Customize portal</SignalPill>
                <h1 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">
                  Turn software ideas into a live peer request marketplace.
                </h1>
                <p className="mt-4 text-sm leading-8 text-nebula-muted">
                  Buyers post requirements, peers boost similar needs, builders
                  claim work, and final outputs can move straight into Surf as
                  marketplace products.
                </p>

                <div className="mt-8 grid gap-3">
                  <FeatureLine
                    icon={PenTool}
                    label="Composer for title, category, budget, urgency, and milestones"
                  />
                  <FeatureLine
                    icon={Repeat2}
                    label="Peer boosts to amplify related demand and cluster similar requests"
                  />
                  <FeatureLine
                    icon={ArrowUpRight}
                    label="Final builds can route into Surf after builder delivery"
                  />
                </div>
              </div>

              <form
                onSubmit={handlePostRequirement}
                className="glass-panel rounded-[32px] p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <SignalPill tone="success">Requirement composer</SignalPill>
                    <h2 className="mt-4 text-3xl font-semibold text-white">
                      Post a custom request
                    </h2>
                  </div>
                  <div className="rounded-3xl border border-nebula-accent/20 bg-nebula-accent/10 p-3 text-nebula-accent">
                    <Sparkles className="size-6" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4">
                  <input
                    value={composer.title}
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Need a deployable AI document parser with slide export"
                    className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <select
                      value={composer.category}
                      onChange={(event) =>
                        setComposer((current) => ({
                          ...current,
                          category: event.target.value,
                        }))
                      }
                      className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none"
                    >
                      {requestCategories.slice(1).map((category) => (
                        <option key={category} value={category} className="bg-slate-950">
                          {category}
                        </option>
                      ))}
                    </select>

                    <input
                      value={composer.budget}
                      onChange={(event) =>
                        setComposer((current) => ({
                          ...current,
                          budget: event.target.value,
                        }))
                      }
                      placeholder="Budget (VC)"
                      className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                    />

                    <select
                      value={composer.urgency}
                      onChange={(event) =>
                        setComposer((current) => ({
                          ...current,
                          urgency: event.target.value,
                        }))
                      }
                      className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none"
                    >
                      {urgencyModes.slice(1).map((urgency) => (
                        <option key={urgency} value={urgency} className="bg-slate-950">
                          {urgency}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    value={composer.details}
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        details: event.target.value,
                      }))
                    }
                    placeholder="Describe the required output, target users, technical constraints, style direction, and anything the builder must preserve."
                    className="h-40 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                  />

                  <textarea
                    value={composer.milestones}
                    onChange={(event) =>
                      setComposer((current) => ({
                        ...current,
                        milestones: event.target.value,
                      }))
                    }
                    placeholder="Optional milestones: research pass, alpha build, revision round, final delivery..."
                    className="h-28 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-nebula-accent/50"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-nebula-accent px-5 py-3 text-sm font-medium text-slate-950 shadow-[0_0_24px_rgba(216,140,255,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ecb1ff]"
                    >
                      <Send className="size-4" />
                      Post requirement
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/76 transition hover:-translate-y-0.5 hover:bg-white/10"
                    >
                      <PlusCircle className="size-4" />
                      Add milestone template
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {notice ? (
            <div className="mx-auto max-w-[1180px]" onClick={() => setNotice(null)}>
              <NoticeBanner tone="info" message={notice} />
            </div>
          ) : null}

          <div className="glass-panel rounded-[36px] p-6 sm:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <SignalPill tone="accent">Request board</SignalPill>
                <h2 className="mt-4 text-4xl font-semibold text-white">
                  Builder-ready custom requests
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76">
                  <Filter className="size-4" />
                  Filters
                </div>
                <select
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76 outline-none"
                >
                  {requestCategories.map((category) => (
                    <option key={category} value={category} className="bg-slate-950">
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  value={activeUrgency}
                  onChange={(event) => setActiveUrgency(event.target.value)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76 outline-none"
                >
                  {urgencyModes.map((urgency) => (
                    <option key={urgency} value={urgency} className="bg-slate-950">
                      {urgency}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="space-y-5">
              {filteredRequests.map((request) => (
                <RequestCard key={request.title} request={request} />
              ))}
            </div>

            <div className="space-y-5">
              <BuilderPanel />
              <DeliveryPanel />
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

function RequestCard({
  request,
}: {
  request: (typeof starterRequests)[number];
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="glass-panel rounded-[32px] p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <SignalPill tone="accent">{request.category}</SignalPill>
            <SignalPill tone={request.urgency === "Hot" ? "warning" : "default"}>
              {request.urgency}
            </SignalPill>
          </div>
          <h3 className="mt-4 text-2xl font-semibold text-white">{request.title}</h3>
          <p className="mt-2 text-sm text-white/50">Posted by {request.author}</p>
          <p className="mt-4 text-sm leading-8 text-nebula-muted">{request.summary}</p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/20 px-5 py-4">
          <div className="text-xs uppercase tracking-[0.24em] text-white/42">Budget</div>
          <div className="mt-2 text-xl font-semibold text-white">{request.budget}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/72">
        <ActionChip icon={Repeat2} label={`${request.boosts} boosts`} />
        <ActionChip icon={MessageSquare} label={`${request.comments} peer updates`} />
        <ActionChip icon={UserRoundPlus} label="Take request" active />
        <ActionChip icon={ArrowUpRight} label="Push final build to Surf" />
      </div>

      <div className="mt-6 rounded-[24px] border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-white/42">
          Delivery timeline
        </div>
        <div className="mt-4 grid gap-3">
          {request.timeline.map((item, index) => (
            <div key={item} className="flex items-center gap-3 text-sm text-white/76">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-nebula-accent/20 bg-nebula-accent/10 text-xs text-nebula-accent">
                0{index + 1}
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function BuilderPanel() {
  return (
    <section className="glass-panel rounded-[32px] p-6">
      <SignalPill tone="success">Builder activity</SignalPill>
      <h3 className="mt-4 text-3xl font-semibold text-white">
        Actions builders and peers can take
      </h3>
      <div className="mt-6 grid gap-3">
        <FeatureLine
          icon={BriefcaseBusiness}
          label="Claim a requirement and become the active builder"
        />
        <FeatureLine
          icon={MessageSquare}
          label="Leave progress updates and technical clarification comments"
        />
        <FeatureLine
          icon={Repeat2}
          label="Boost similar requests when multiple users need related outcomes"
        />
      </div>
    </section>
  );
}

function DeliveryPanel() {
  return (
    <section className="glass-panel rounded-[32px] p-6">
      <SignalPill tone="accent">Protocol delivery</SignalPill>
      <h3 className="mt-4 text-3xl font-semibold text-white">
        From request board to marketplace artifact
      </h3>
      <div className="mt-6 space-y-4">
        <DeliveryStep
          icon={PenTool}
          title="Requirement posted"
          description="The buyer defines the problem, budget, urgency, and milestones."
        />
        <DeliveryStep
          icon={Clock3}
          title="Builder updates"
          description="Peers discuss scope, claim work, and share visible progress updates."
        />
        <DeliveryStep
          icon={FileStack}
          title="Final build pushed to Surf"
          description="The delivered software or asset becomes a verified marketplace listing."
        />
      </div>
    </section>
  );
}

function DeliveryStep({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof PenTool;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-nebula-accent/20 bg-nebula-accent/10 p-2 text-nebula-accent">
          <Icon className="size-4" />
        </div>
        <div className="text-lg font-medium text-white">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-7 text-nebula-muted">{description}</p>
    </div>
  );
}

function ActionChip({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Repeat2;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition hover:-translate-y-0.5",
        active
          ? "border-nebula-accent/30 bg-nebula-accent/12 text-white"
          : "border-white/10 bg-white/5 text-white/72 hover:bg-white/10 hover:text-white",
      )}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function FeatureLine({
  icon: Icon,
  label,
}: {
  icon: typeof PenTool;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/76">
      <Icon className="size-4 text-nebula-accent" />
      <span>{label}</span>
    </div>
  );
}
