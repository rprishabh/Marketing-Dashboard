"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Megaphone,
  GitBranch,
  Cpu,
  Terminal,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Command Center",
    href: "/",
    icon: LayoutDashboard,
    description: "Marketing Overview KPIs",
    colorClass: "text-pink-400",
  },
  {
    label: "Paid Ads",
    href: "/paid",
    icon: Megaphone,
    description: "Performance campaigns",
    colorClass: "text-cyan-400",
  },
  {
    label: "Pipeline/Funnels",
    href: "/pipeline",
    icon: GitBranch,
    description: "Funnel conversions metrics",
    colorClass: "text-amber-400",
  },
  {
    label: "AI Automations",
    href: "/diagnostics",
    icon: Cpu,
    description: "Marketing bots engine",
    colorClass: "text-violet-400",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-72 flex-shrink-0 border-r border-fuchsia-500/20 bg-slate-950 flex flex-col overflow-hidden z-30">
      {/* ── Header ──────────────────────────────── */}
      <div className="p-5 border-b border-fuchsia-500/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-tr from-pink-500 to-violet-600 shadow-[0_0_10px_rgba(236,72,153,0.3)]">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-pink-500 rounded-full status-dot-pulse" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent uppercase">
              MKT-OPS 🚀
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest">
              v3.2.1 // MARKETING ENGAGED
            </p>
          </div>
        </div>

        {/* Connection status */}
        <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-md bg-fuchsia-500/10 border border-fuchsia-500/20 shadow-[0_0_10px_rgba(236,72,153,0.05)]">
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse-glow" />
          <span className="text-[11px] text-pink-300 font-bold font-mono tracking-wide">
            FUNNEL ENGINE ONLINE
          </span>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.25em] text-pink-400/60 uppercase font-mono">
          OPERATIONAL INDEX
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-300 relative
                ${
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-500/15 via-purple-500/5 to-transparent border border-fuchsia-500/35 nav-active-indicator shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                    : "border border-transparent hover:bg-slate-900/80 hover:border-pink-500/10"
                }
              `}
            >
              <Icon
                className={`w-4.5 h-4.5 flex-shrink-0 transition-all ${
                  isActive ? "text-pink-400 drop-shadow-[0_0_5px_#ec4899]" : "text-slate-500 group-hover:text-pink-400/80"
                }`}
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-sm font-bold truncate transition-colors ${
                    isActive ? "text-fuchsia-300 text-glow-rose" : "text-slate-300 group-hover:text-slate-100"
                  }`}
                >
                  {item.label}
                </span>
                <span className={`block text-[10px] truncate ${isActive ? "text-purple-300/80" : "text-slate-500"}`}>
                  {item.description}
                </span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 flex-shrink-0 transition-all ${
                  isActive
                    ? "text-pink-500 opacity-100 translate-x-0.5"
                    : "text-slate-700 opacity-0 group-hover:opacity-100 group-hover:text-pink-500"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ──────────────────────────────── */}
      <div className="p-4 border-t border-fuchsia-500/10 bg-slate-950/40">
        <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono mb-1.5">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse" />
            <span>BUDGET FLOW</span>
          </div>
          <span className="text-pink-400 font-bold">84.7%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-900 border border-fuchsia-500/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 shadow-[0_0_8px_#ec4899]"
            style={{ width: "84.7%" }}
          />
        </div>
      </div>
    </aside>
  );
}
