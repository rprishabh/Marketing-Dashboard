"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useBusinessModel } from "./context/BusinessModelContext";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  Terminal as TerminalIcon,
  Globe,
  PiggyBank,
  Share2,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ── Types ────────────────────────────────────────────────

interface LinkedInCampaign {
  id: string;
  name: string;
  type: "Enterprise LinkedIn Ads";
  status: "active";
  objective: string;
  spend: number;
  clicks: number;
  ctr: number;
  leads: number;
  costPerLead: number;
}

interface TikTokCampaign {
  id: string;
  name: string;
  type: "TikTok Influencer";
  status: "active";
  creator: string;
  spend: number;
  installs: number;
  cpi: number;
  engagementRate: number;
}

interface MetaCatalogCampaign {
  id: string;
  name: string;
  type: "Meta Catalog Sales";
  status: "active";
  catalog: string;
  spend: number;
  revenue: number;
  roas: number;
  purchases: number;
}

type Campaign = LinkedInCampaign | TikTokCampaign | MetaCatalogCampaign;

interface HistoricalPoint {
  date: string;
  [key: string]: string | number;
}

interface B2BData {
  model: "b2b";
  label: "SaaS";
  generatedAt: string;
  total_mqls: number;
  sql_conversion_rate: number;
  pipeline_velocity: number;
  blended_cac: number;
  campaigns: LinkedInCampaign[];
  historical_chart_data: HistoricalPoint[];
}

interface B2CData {
  model: "b2c";
  label: "Mobile/App";
  generatedAt: string;
  daily_active_users: number;
  cost_per_install: number;
  app_store_conversion_rate: number;
  viral_coefficient: number;
  campaigns: TikTokCampaign[];
  historical_chart_data: HistoricalPoint[];
}

interface D2CData {
  model: "d2c";
  label: "E-commerce";
  generatedAt: string;
  average_order_value: number;
  return_on_ad_spend: number;
  cart_abandonment_rate: number;
  customer_lifetime_value: number;
  campaigns: MetaCatalogCampaign[];
  historical_chart_data: HistoricalPoint[];
}

type ApiResponse = B2BData | B2CData | D2CData;

// ── Shared Tooltip Styles ────────────────────────────────
const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "2px solid rgba(236, 72, 153, 0.4)",
  borderRadius: 8,
  fontSize: 12,
  color: "#f8fafc",
  fontFamily: "monospace",
};

// ── Agent Log Pool ───────────────────────────────────────
const AGENT_LOG_MESSAGES = [
  { type: "ad", msg: "Agent: Optimizing Meta ad bidding metrics via predictive ROI weights..." },
  { type: "content", msg: "Agent: Crafting contextual email templates for automated pipeline follow-up..." },
  { type: "anomaly", msg: "Agent: Flagging conversion anomalies on localized landing page variants..." },
  { type: "funnel", msg: "Agent: Synthesizing real-time acquisition funnel performance matrices..." },
  { type: "keyword", msg: "Agent: Scanning dynamic keyword bids on paid search search terms..." },
  { type: "seo", msg: "Agent: Generating programmatic SEO metadata drafts for catalog products..." },
  { type: "sync", msg: "Agent: Syncing CRM deal pipeline modifications with active node clusters..." },
  { type: "budget", msg: "Agent: Restructuring campaign budgets away from low-efficiency placements..." },
  { type: "creator", msg: "Agent: Evaluating TikTok creator engagement metrics for scaling signals..." },
  { type: "lead", msg: "Agent: Automating lead qualification triggers for incoming demo requests..." },
];

export default function CommandCenterPage() {
  const { businessModel } = useBusinessModel();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string>("");

  // Terminal Logs State
  const [logs, setLogs] = useState<{ time: string; msg: string; type: string }[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Fetch metrics callback
  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const modelQuery = businessModel.toLowerCase();
      const res = await fetch(`/api/metrics?model=${modelQuery}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`API returned status ${res.status}`);
      const json: ApiResponse = await res.json();
      setData(json);
      setLastFetched(new Date().toLocaleTimeString());
      
      // Seed terminal logs on fetch
      const time = new Date().toLocaleTimeString();
      setLogs((prev) => [
        ...prev,
        {
          time,
          msg: `SYSTEM: Connected successfully. Loaded ${json.label} segments in core buffer.`,
          type: "system",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  }, [businessModel]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics, businessModel]);

  // Handle agent log updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString();
      const randomLogObj = AGENT_LOG_MESSAGES[Math.floor(Math.random() * AGENT_LOG_MESSAGES.length)];
      setLogs((prev) => {
        const next = [...prev, { time, msg: randomLogObj.msg, type: randomLogObj.type }];
        return next.slice(-40); // Keep last 40 entries
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Scroll terminal logs container only (prevent window scroll jumps)
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
        <p className="text-sm text-slate-400 font-mono animate-pulse">
          Connecting to data buffer for {businessModel} segment...
        </p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-sm text-rose-400 font-mono">{error}</p>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 rounded-lg border border-pink-500/20 bg-pink-500/10 text-pink-400 text-xs hover:bg-pink-500/20 transition-colors font-mono"
        >
          Re-establish Connection
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Format large numbers
  const formatNum = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toString();
  };

  // Determine what key and styling to use depending on model
  const getThemeConfig = () => {
    if (data.model === "b2b") {
      return {
        dataKey: "pipeline_value",
        label: "Pipeline Value ($)",
        formatter: (val: number) => `$${val.toLocaleString()}`,
        stroke: "#8b5cf6", // Violet
        gradientId: "violetGrad",
        cardBorder: "border-violet-500/20 hover:border-violet-500/50",
        cornerClass: "border-violet-400",
        btnClass: "border-violet-500/30 text-violet-400 hover:bg-violet-500/10",
        sysLabel: "text-violet-400",
        accentGlow: "rgba(139, 92, 246, 0.1)",
      };
    } else if (data.model === "b2c") {
      return {
        dataKey: "dau",
        label: "Daily Active Users (DAU)",
        formatter: (val: number) => val.toLocaleString(),
        stroke: "#ec4899", // Pink
        gradientId: "pinkGrad",
        cardBorder: "border-pink-500/20 hover:border-pink-500/50",
        cornerClass: "border-pink-400",
        btnClass: "border-pink-500/30 text-pink-400 hover:bg-pink-500/10",
        sysLabel: "text-pink-400",
        accentGlow: "rgba(236, 72, 153, 0.1)",
      };
    } else {
      return {
        dataKey: "revenue",
        label: "Direct Store Revenue ($)",
        formatter: (val: number) => `$${val.toLocaleString()}`,
        stroke: "#f59e0b", // Amber/Orange
        gradientId: "amberGrad",
        cardBorder: "border-amber-500/20 hover:border-amber-500/50",
        cornerClass: "border-amber-400",
        btnClass: "border-amber-500/30 text-amber-400 hover:bg-amber-500/10",
        sysLabel: "text-amber-400",
        accentGlow: "rgba(245, 158, 11, 0.1)",
      };
    }
  };

  const theme = getThemeConfig();

  // Terminal log line color mapper
  const getLogColorClass = (type: string) => {
    switch (type) {
      case "system": return "text-cyan-400 font-bold";
      case "ad": return "text-pink-400";
      case "budget": return "text-violet-400";
      case "anomaly": return "text-rose-400 font-semibold";
      case "creator": return "text-emerald-400";
      case "keyword": return "text-amber-400";
      default: return "text-slate-300";
    }
  };

  return (
    <div className="space-y-8 animate-slide-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mb-1">
            <span className="text-pink-500 font-extrabold animate-pulse">⚡</span>
            <span className="uppercase font-bold tracking-widest text-slate-400">MISSION_CONTROL / {data.model.toUpperCase()}</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-pink-400 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent uppercase font-sans">
            Marketing Mission Control 🛰️
          </h2>
          <p className="text-sm text-slate-300 mt-1 font-medium">
            Dynamic statistics feed for the <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent font-bold">{data.label}</span> segment class.
          </p>
        </div>
        <button
          onClick={fetchMetrics}
          disabled={loading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 ${theme.btnClass} bg-slate-900/60 transition-all duration-300 font-bold text-xs shadow-[0_0_15px_rgba(236,72,153,0.1)] relative`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Force Metric Sync
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
        </button>
      </div>

      {/* ── Dynamic KPI Grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {data.model === "b2b" && (
          <>
            {/* KPI 1 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-violet-500/10">
                  <Users className="w-5 h-5 text-violet-400 text-glow-violet" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +14.5%
                </span>
              </div>
              <p className="text-[10px] text-violet-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Total MQLs</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.total_mqls.toLocaleString()}</p>
            </div>
            {/* KPI 2 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-violet-500/10">
                  <Target className="w-5 h-5 text-violet-400 text-glow-violet" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +2.8%
                </span>
              </div>
              <p className="text-[10px] text-violet-300/80 uppercase tracking-widest font-bold mb-1 font-mono">SQL Conversion Rate</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.sql_conversion_rate}%</p>
            </div>
            {/* KPI 3 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10">
                  <Activity className="w-5 h-5 text-cyan-400 text-glow-cyan" />
                </div>
                <span className="text-xs text-cyan-400 font-bold font-mono">Optimal</span>
              </div>
              <p className="text-[10px] text-violet-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Pipeline Velocity</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.pipeline_velocity} days</p>
            </div>
            {/* KPI 4 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-violet-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-violet-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(139,92,246,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-violet-400 pointer-events-none group-hover:border-violet-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <DollarSign className="w-5 h-5 text-amber-400 text-glow-amber" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -6.2%
                </span>
              </div>
              <p className="text-[10px] text-violet-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Blended CAC</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">${data.blended_cac.toFixed(0)}</p>
            </div>
          </>
        )}

        {data.model === "b2c" && (
          <>
            {/* KPI 1 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-pink-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-pink-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(236,72,153,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-pink-500/10">
                  <Users className="w-5 h-5 text-pink-400 text-glow-rose" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +21.4%
                </span>
              </div>
              <p className="text-[10px] text-pink-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Daily Active Users</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{formatNum(data.daily_active_users)}</p>
            </div>
            {/* KPI 2 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-pink-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-pink-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(236,72,153,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <DollarSign className="w-5 h-5 text-amber-400 text-glow-amber" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -11.5%
                </span>
              </div>
              <p className="text-[10px] text-pink-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Cost Per Install</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">${data.cost_per_install.toFixed(2)}</p>
            </div>
            {/* KPI 3 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-pink-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-pink-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(236,72,153,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-pink-500/10">
                  <Target className="w-5 h-5 text-pink-400 text-glow-rose" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.7%
                </span>
              </div>
              <p className="text-[10px] text-pink-300/80 uppercase tracking-widest font-bold mb-1 font-mono">App Store Conv. Rate</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.app_store_conversion_rate}%</p>
            </div>
            {/* KPI 4 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-pink-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-pink-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(236,72,153,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-pink-400 pointer-events-none group-hover:border-pink-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-violet-500/10">
                  <Share2 className="w-5 h-5 text-violet-400 text-glow-violet" />
                </div>
                <span className="text-xs text-violet-400 font-bold font-mono">K-Factor</span>
              </div>
              <p className="text-[10px] text-pink-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Viral Coefficient</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.viral_coefficient}x</p>
            </div>
          </>
        )}

        {data.model === "d2c" && (
          <>
            {/* KPI 1 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10">
                  <PiggyBank className="w-5 h-5 text-cyan-400 text-glow-cyan" />
                </div>
                <span className="text-xs text-cyan-400 font-bold font-mono">Nominal</span>
              </div>
              <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Average Order Value</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">${data.average_order_value.toFixed(2)}</p>
            </div>
            {/* KPI 2 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10">
                  <TrendingUp className="w-5 h-5 text-amber-400 text-glow-amber" />
                </div>
                <span className="text-xs text-emerald-400 flex items-center font-bold">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +15.8%
                </span>
              </div>
              <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Ad Spend ROAS</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.return_on_ad_spend}x</p>
            </div>
            {/* KPI 3 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-rose-500/10">
                  <Layers className="w-5 h-5 text-rose-400 text-glow-rose" />
                </div>
                <span className="text-xs text-rose-400 font-bold font-mono">Drop-off</span>
              </div>
              <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Cart Abandonment</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">{data.cart_abandonment_rate}%</p>
            </div>
            {/* KPI 4 */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-amber-500/20 rounded-xl p-5 relative overflow-hidden transition-all duration-300 hover:border-amber-500/50 hover:translate-y-[-4px] group shadow-[0_4px_20px_rgba(245,158,11,0.05)]">
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400 pointer-events-none group-hover:border-amber-300" />
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-violet-500/10">
                  <Sparkles className="w-5 h-5 text-violet-400 text-glow-violet" />
                </div>
                <span className="text-xs text-emerald-400 font-bold font-mono">High LTV</span>
              </div>
              <p className="text-[10px] text-amber-300/80 uppercase tracking-widest font-bold mb-1 font-mono">Customer LTV (CLV)</p>
              <p className="text-3xl font-extrabold text-white tracking-tight">${data.customer_lifetime_value.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>

      {/* ── Large Performance Area Chart ──────────────────── */}
      <div className={`bg-slate-900/50 backdrop-blur-md border ${theme.cardBorder} rounded-xl p-6 relative overflow-hidden group shadow-[0_4px_30px_rgba(9,9,14,0.1)]`}>
        {/* Cyber Corner Accents */}
        <span className={`absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 ${theme.cornerClass} pointer-events-none transition-colors duration-300`} />
        <span className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 ${theme.cornerClass} pointer-events-none transition-colors duration-300`} />
        <span className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 ${theme.cornerClass} pointer-events-none transition-colors duration-300`} />
        <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 ${theme.cornerClass} pointer-events-none transition-colors duration-300`} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-200 tracking-wider flex items-center gap-2">
              <Activity className={`w-5 h-5 ${theme.sysLabel} animate-pulse`} />
              30-Day Performance Curve ({theme.label})
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">
              Live index stream // Model: {data.label}
            </p>
          </div>
          <span className={`text-[10px] ${theme.sysLabel} font-mono border-2 ${theme.cardBorder} px-3 py-1 rounded-lg bg-slate-950/80 shadow-[0_0_10px_${theme.accentGlow}]`}>
            ACTIVE_CHART_FEED
          </span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.historical_chart_data}>
              <defs>
                <linearGradient id={theme.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={theme.stroke} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={theme.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(236,72,153,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#cbd5e1" }}
                tickLine={false}
                axisLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#cbd5e1" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v.toString())}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(val) => [theme.formatter(Number(val)), theme.label]}
              />
              <Area
                type="monotone"
                dataKey={theme.dataKey}
                stroke={theme.stroke}
                strokeWidth={3}
                fill={`url(#${theme.gradientId})`}
                name={theme.label}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Campaign Registry Table ────────────────────────── */}
      <div className={`bg-slate-900/50 backdrop-blur-md border ${theme.cardBorder} rounded-xl overflow-hidden relative group shadow-[0_4px_30px_rgba(9,9,14,0.1)]`}>
        {/* Cyber Corner Accents */}
        <span className={`absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 ${theme.cornerClass} pointer-events-none`} />
        <span className={`absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 ${theme.cornerClass} pointer-events-none`} />
        <span className={`absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 ${theme.cornerClass} pointer-events-none`} />
        <span className={`absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 ${theme.cornerClass} pointer-events-none`} />

        <div className="p-5 border-b border-fuchsia-500/10 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-200 font-sans flex items-center gap-2">
            <Sparkles className={`w-4.5 h-4.5 ${theme.sysLabel}`} />
            Active Campaign Performance Registry ({data.model === "b2b" ? "LinkedIn Ads" : data.model === "b2c" ? "TikTok Influencer" : "Meta Catalog"})
          </h3>
          <span className="text-[10px] text-fuchsia-400 font-mono tracking-widest font-bold">5 ACTIVE STREAMS</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-fuchsia-500/15 text-slate-300 bg-slate-950/40 font-mono">
                <th className="p-4 uppercase tracking-wider">Campaign Identifier</th>
                <th className="p-4 text-right uppercase tracking-wider">Spend</th>
                {data.model === "b2b" && (
                  <>
                    <th className="p-4 uppercase tracking-wider">Objective</th>
                    <th className="p-4 text-right uppercase tracking-wider">Leads</th>
                    <th className="p-4 text-right uppercase tracking-wider">Cost Per Lead</th>
                  </>
                )}
                {data.model === "b2c" && (
                  <>
                    <th className="p-4 uppercase tracking-wider">Creator</th>
                    <th className="p-4 text-right uppercase tracking-wider">Installs</th>
                    <th className="p-4 text-right uppercase tracking-wider">Cost Per Install</th>
                  </>
                )}
                {data.model === "d2c" && (
                  <>
                    <th className="p-4 uppercase tracking-wider">Catalog Feed</th>
                    <th className="p-4 text-right uppercase tracking-wider">Purchases</th>
                    <th className="p-4 text-right uppercase tracking-wider">ROAS</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {data.campaigns.map((c) => (
                <tr key={c.id} className="border-b border-fuchsia-500/5 hover:bg-fuchsia-500/5 transition-colors">
                  <td className="p-4 text-slate-100 font-bold">{c.name}</td>
                  <td className="p-4 text-right text-slate-300 font-mono font-bold">${c.spend.toLocaleString()}</td>
                  
                  {data.model === "b2b" && "objective" in c && (
                    <>
                      <td className="p-4 text-slate-400 font-mono">{c.objective}</td>
                      <td className="p-4 text-right text-violet-400 font-bold font-mono">{c.leads.toLocaleString()}</td>
                      <td className="p-4 text-right text-emerald-400 font-bold font-mono">${c.costPerLead.toFixed(2)}</td>
                    </>
                  )}

                  {data.model === "b2c" && "creator" in c && (
                    <>
                      <td className="p-4 text-cyan-400 font-bold font-mono">{c.creator}</td>
                      <td className="p-4 text-right text-pink-400 font-bold font-mono">{c.installs.toLocaleString()}</td>
                      <td className="p-4 text-right text-emerald-400 font-bold font-mono">${c.cpi.toFixed(2)}</td>
                    </>
                  )}

                  {data.model === "d2c" && "catalog" in c && (
                    <>
                      <td className="p-4 text-slate-400">{c.catalog}</td>
                      <td className="p-4 text-right text-violet-400 font-bold font-mono">{c.purchases.toLocaleString()}</td>
                      <td className="p-4 text-right text-amber-400 font-bold font-mono">{c.roas}x</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Live AI Automation Logs Section ───────────────── */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-fuchsia-500/20 rounded-xl p-6 relative overflow-hidden group shadow-[0_4px_30px_rgba(9,9,14,0.1)]">
        {/* Cyber Corner Accents */}
        <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-pink-400 pointer-events-none" />
        <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-pink-400 pointer-events-none" />
        <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-pink-400 pointer-events-none" />
        <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-pink-400 pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <TerminalIcon className="w-5 h-5 text-pink-400 text-glow-rose animate-pulse" />
          <h3 className="text-sm font-bold text-slate-200 font-mono">Live AI Automation Logs</h3>
          <span className="w-2.5 h-2.5 bg-pink-500 rounded-full status-dot-pulse ml-2" />
        </div>
        
        {/* Terminal interface */}
        <div 
          ref={terminalRef}
          className="bg-black border border-fuchsia-500/30 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs shadow-inner flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent scanline-overlay relative"
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className={`${getLogColorClass(log.type)} tracking-wide font-medium`}
            >
              [{log.time}] {log.msg}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Diagnostic Panel */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-fuchsia-500/20 rounded-xl p-4 flex flex-wrap gap-6 items-center text-[11px] font-mono text-slate-450 relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full status-dot-pulse" />
          <span>CYBER_API: <span className="text-pink-400 font-bold">CONNECTED (/api/metrics)</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-pink-500 rounded-full status-dot-pulse" />
          <span>MODEL_SEGMENT: <span className="text-pink-400 font-bold">{data.model.toUpperCase()}</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full" />
          <span>SYS_TIME: <span className="text-cyan-400 font-bold">{lastFetched || "UNKNOWN"}</span></span>
        </div>
        <div className="ml-auto text-slate-400 font-bold">
          GENERATED_AT: {new Date(data.generatedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
