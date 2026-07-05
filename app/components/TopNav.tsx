"use client";

import React from "react";
import { useBusinessModel, type BusinessModel } from "../context/BusinessModelContext";

export default function TopNav() {
  const { businessModel, setBusinessModel } = useBusinessModel();

  const models: BusinessModel[] = ["B2B", "B2C", "D2C"];

  // Custom styling colors for active selection depending on the business model
  const activeColorMap = {
    B2B: "bg-violet-500/20 border-violet-500 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.4)]",
    B2C: "bg-pink-500/20 border-pink-500 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.4)]",
    D2C: "bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.4)]",
  };

  const modelGlowDot = {
    B2B: "bg-violet-400 shadow-[0_0_6px_#8b5cf6]",
    B2C: "bg-pink-400 shadow-[0_0_6px_#ec4899]",
    D2C: "bg-amber-400 shadow-[0_0_6px_#f59e0b]",
  };

  const titleColor = {
    B2B: "from-violet-400 via-fuchsia-400 to-pink-400",
    B2C: "from-pink-400 via-rose-400 to-orange-400",
    D2C: "from-amber-400 via-orange-400 to-yellow-400",
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur-lg bg-slate-950/80 border-b border-fuchsia-500/20 px-8 py-4 flex items-center justify-between">
      {/* Left section: Terminal prompt style */}
      <div className="flex items-center gap-3 text-xs font-mono">
        <span className="text-pink-500 font-bold">$</span>
        <span className="text-slate-400 font-bold uppercase tracking-wider">mkt-ops</span>
        <span className="text-fuchsia-500/30">//</span>
        <span className={`bg-gradient-to-r ${titleColor[businessModel]} bg-clip-text text-transparent font-extrabold text-sm tracking-wide`}>
          SYS_MODEL: {businessModel}
        </span>
        <span className="text-slate-700 hidden sm:inline">—</span>
        <span className="text-slate-300 font-bold hidden sm:inline">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="animate-blink text-pink-500">▋</span>
      </div>

      {/* Middle/Right: Playful, colorful Segment Select */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-fuchsia-400/80 font-extrabold uppercase tracking-[0.2em] font-mono hidden md:inline">
            SELECT SEGMENT CLASS:
          </span>
          <div className="flex items-center p-1 rounded-xl border border-fuchsia-500/30 bg-slate-900/90 relative shadow-[0_0_20px_rgba(236,72,153,0.1)]">
            {/* Corner Bracket Accents */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-pink-400 pointer-events-none" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-pink-400 pointer-events-none" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-pink-400 pointer-events-none" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-pink-400 pointer-events-none" />

            {models.map((model) => {
              const isActive = businessModel === model;
              return (
                <button
                  key={model}
                  onClick={() => setBusinessModel(model)}
                  className={`
                    relative px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-[0.2em] transition-all duration-300
                    ${
                      isActive
                        ? `${activeColorMap[model]} border border-transparent`
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent"
                    }
                  `}
                >
                  [{model}]
                  {isActive && (
                    <span className={`absolute -top-0.5 -left-0.5 w-1.5 h-1.5 rounded-full ${modelGlowDot[model]}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right status */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider font-mono hidden sm:inline">
            LOAD: NOMINAL
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-pink-400/80 font-bold tracking-wider uppercase">
              ACTIVE_CONN
            </span>
            <div className="w-2.5 h-2.5 bg-pink-500 rounded-full status-dot-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}
