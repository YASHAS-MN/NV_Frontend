"use client";

import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export function NoticeBanner({
  tone,
  message,
}: {
  tone: "info" | "success" | "error";
  message: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[24px] border px-4 py-4 text-sm leading-7",
        tone === "success" && "border-nebula-signal/25 bg-nebula-signal/10 text-nebula-signal",
        tone === "error" && "border-nebula-danger/25 bg-nebula-danger/10 text-[#ffc3cc]",
        tone === "info" && "border-nebula-accent/25 bg-nebula-accent/10 text-[#d7e7ff]",
      )}
    >
      <CircleAlert className="mt-1 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
