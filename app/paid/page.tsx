"use client";

import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  DollarSign,
  MousePointerClick,
  Eye,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { generateAdCampaigns, generateAdTimeSeries } from "../lib/data";

export default function PaidPerformancePage() {
  const campaigns = useMemo(() => generateAdCampaigns(), []);
  const timeSeries = useMemo(() => generateAdTimeSeries(), []);
  const [platformFilter, setPlatformFilter] = useState<"all" | "google" | "meta">("all");

  const filtered = campaigns.filter(
    (c) => platformFilter === "all" || c.platform === platformFilter
  );

  // Aggregate stats
  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, c) => ({
        spend: acc.spend + c.spend,
        impressions: acc.impressions + c.impressions,
        clicks: acc.clicks + c.clicks,
        conversions: acc.conversions + c.conversions,
      }),
      { spend: 0, impressions: 0, clicks: 0, conversions: 0 }
    );
  }, [filtered]);

  const pieData = useMemo(() => {
    const google = campaigns.filter((c) => c.platform === "google").reduce((s, c) => s + c.spend, 0);
    const meta = campaigns.filter((c) => c.platform === "meta").reduce((s, c) => s + c.spend, 0);
    return [
      { name: "Google Ads", value: google, color: "#10b981" },
      { name: "Meta Ads", value: meta, color: "#06b6d4" },
    ];
  }, [campaigns]);

  const statsCards = [
    { label: "Total Spend", value: `$${(totals.spend / 1000).toFixed(1)}K`, icon: DollarSign, color: "emerald" },
    { label: "Impressions", value: `${(totals.impressions / 1000000).toFixed(2)}M`, icon: Eye, color: "cyan" },
    { label: "Clicks", value: `${(totals.clicks / 1000).toFixed(1)}K`, icon: MousePointerClick, color: "violet" },
    { label: "Conversions", value: totals.conversions.toLocaleString(), icon: ShoppingCart, color: "amber" },
  ];

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 text-glow-emerald",
    cyan: "text-cyan-400 text-glow-cyan",
    violet: "text-violet-400 text-glow-violet",
    amber: "text-amber-400 text-glow-amber",
  };

  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-500/10",
    cyan: "bg-cyan-500/10",
    violet: "bg-violet-500/10",
    amber: "bg-amber-500/10",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mb-1">
          <span className="text-cyan-500">▸</span>
          <span>SYSTEM / PAID_PERFORMANCE</span>
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 text-glow-cyan tracking-wide">
          Paid Performance
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Google Ads & Meta Ads campaign metrics and analytics
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="kpi-card bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${bgMap[stat.color]}`}>
                  <Icon className={`w-4 h-4 ${colorMap[stat.color]}`} />
                </div>
                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                  {stat.label}
                </span>
              </div>
              <p className="text-xl font-bold text-slate-100">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time series */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-300">Daily Spend Comparison</h3>
              <p className="text-[10px] text-slate-600 mt-1">GOOGLE VS META // 30-DAY WINDOW</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-500/50" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeries}>
                <defs>
                  <linearGradient id="paidGradGoogle" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paidGradMeta" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.95)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="google" stroke="#10b981" strokeWidth={2} fill="url(#paidGradGoogle)" name="Google" />
                <Area type="monotone" dataKey="meta" stroke="#06b6d4" strokeWidth={2} fill="url(#paidGradMeta)" name="Meta" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-300 mb-1">Spend Allocation</h3>
          <p className="text-[10px] text-slate-600 mb-6">BY PLATFORM</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.8} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.95)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-slate-400">{d.name}</span>
                </div>
                <span className="text-slate-300 font-bold">${(d.value / 1000).toFixed(1)}K</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign table */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="p-5 border-b border-emerald-500/10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-300">Campaign Registry</h3>
            <p className="text-[10px] text-slate-600 mt-1">
              {filtered.length} CAMPAIGNS // {filtered.filter((c) => c.status === "active").length} ACTIVE
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Platform filter */}
            <div className="flex items-center rounded-lg border border-emerald-500/15 overflow-hidden text-xs">
              {(["all", "google", "meta"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-3 py-1.5 transition-colors capitalize ${
                    platformFilter === p
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-emerald-500/10 text-slate-500">
                <th className="text-left p-3 pl-5 font-bold tracking-wider uppercase">Campaign</th>
                <th className="text-left p-3 font-bold tracking-wider uppercase">Platform</th>
                <th className="text-left p-3 font-bold tracking-wider uppercase">Status</th>
                <th className="text-right p-3 font-bold tracking-wider uppercase">Spend</th>
                <th className="text-right p-3 font-bold tracking-wider uppercase">Clicks</th>
                <th className="text-right p-3 font-bold tracking-wider uppercase">CTR</th>
                <th className="text-right p-3 font-bold tracking-wider uppercase">Conv.</th>
                <th className="text-right p-3 font-bold tracking-wider uppercase">CPC</th>
                <th className="text-right p-3 pr-5 font-bold tracking-wider uppercase">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-b border-emerald-500/5 hover:bg-emerald-500/5 transition-colors"
                >
                  <td className="p-3 pl-5 text-slate-300 font-medium">{campaign.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        campaign.platform === "google"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-cyan-500/10 text-cyan-400"
                      }`}
                    >
                      {campaign.platform}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          campaign.status === "active"
                            ? "bg-emerald-500 status-dot-pulse"
                            : campaign.status === "paused"
                            ? "bg-amber-500"
                            : "bg-slate-600"
                        }`}
                      />
                      <span
                        className={`text-[10px] uppercase ${
                          campaign.status === "active"
                            ? "text-emerald-400"
                            : campaign.status === "paused"
                            ? "text-amber-400"
                            : "text-slate-500"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </span>
                  </td>
                  <td className="p-3 text-right text-slate-300">${campaign.spend.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-400">{campaign.clicks.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-400">{campaign.ctr}%</td>
                  <td className="p-3 text-right text-slate-300 font-medium">{campaign.conversions}</td>
                  <td className="p-3 text-right text-slate-400">${campaign.cpc}</td>
                  <td className="p-3 pr-5 text-right">
                    <span
                      className={`font-bold ${
                        campaign.roas >= 4 ? "text-emerald-400" : campaign.roas >= 2 ? "text-amber-400" : "text-rose-400"
                      }`}
                    >
                      {campaign.roas}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
