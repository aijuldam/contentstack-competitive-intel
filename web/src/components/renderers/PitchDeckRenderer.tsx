"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { PitchDeckRenderOutput, SlideData } from "@/lib/renderers/types";

interface Props {
  output: PitchDeckRenderOutput;
  className?: string;
}

export function PitchDeckRenderer({ output, className }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = output.slides[activeIndex];

  return (
    <div className={cn("flex h-full flex-col bg-slate-950", className)}>
      {/* Slide thumbnails */}
      <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-800 px-4 py-2">
        {output.slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded px-3 py-1.5 text-xs transition-colors",
              i === activeIndex
                ? "bg-slate-700 font-medium text-white"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
          >
            {s.slideNumber}. {s.title}
          </button>
        ))}
      </div>

      {/* Active slide */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-10">
        <SlideCard slide={slide} total={output.slides.length} />
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between border-t border-slate-800 px-6 py-3">
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-400 hover:text-white"
          disabled={activeIndex === 0}
          onClick={() => setActiveIndex((i) => i - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-xs text-slate-500">
          {activeIndex + 1} / {output.slides.length}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="text-slate-400 hover:text-white"
          disabled={activeIndex === output.slides.length - 1}
          onClick={() => setActiveIndex((i) => i + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SlideCard({ slide, total }: { slide: SlideData; total: number }) {
  return (
    <div
      className="relative w-full max-w-4xl rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10"
      style={{ aspectRatio: "16/9" }}
    >
      <span className="absolute right-6 top-5 text-xs text-slate-500 tabular-nums">
        {slide.slideNumber} / {total}
      </span>
      <div className="flex h-full flex-col justify-center px-12 py-10 lg:px-16 lg:py-12">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
          {slide.title}
        </p>
        <p
          className={cn(
            "font-light leading-relaxed text-white",
            slide.slideNumber === 1 ? "text-2xl lg:text-3xl" : "text-lg lg:text-xl"
          )}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {slide.content}
        </p>
      </div>
      <div className="absolute bottom-5 right-6">
        <Badge
          variant={slide.confidence === "verified" ? "verified" : "inferred"}
          className="text-2xs"
        >
          {slide.confidence}
        </Badge>
      </div>
    </div>
  );
}
