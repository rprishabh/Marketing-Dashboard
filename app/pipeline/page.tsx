"use client";

import React, { useMemo, useState } from "react";
import {
  GitBranch,
  Building2,
  DollarSign,
  Clock,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { generatePipelineDeals, generatePipelineSummary, getPipelineStages } from "../lib/data";

export default function PipelinePage() {
  const deals = useMemo(() => generatePipelineDeals(), []);
  const summary = useMemo(() => generatePipelineSummary(), []);
  const stages = getPipelineStages();
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const totalValue = deals.reduce((s, d) => s + d.value, 0);
  const avgDealSize = Math.round(totalValue / deals.length);
  const weightedPipeline = deals.reduce((s, d) => s + d.value * (d.probability / 100), 0);

  // Stages for the visual pipeline
  const stageColors = [
    "border-slate-600 bg-slate-800/40",
    "border-blue-500/30 bg-blue-500/5",
    "border-cyan-500/30 bg-cyan-500/5",
    "border-emerald-500/30 bg-emerald-500/5",
    "border-violet-500/30 bg-violet-500/5",
    "border-amber-500/30 bg-amber-500/5",
    "border-emerald-400/40 bg-emerald-400/10",
    "border-rose-500/30 bg-rose-500/5",
  ];

  const stageTextColors = [
    "text-slate-400",
    "text-blue-400",
    "text-cyan-400",
    "text-emerald-400",
    "text-violet-400",
    "text-amber-400",
    "text-emerald-300",
    "text-rose-400",
  ];

  const treemapData = summary.map((s, i) => ({
    name: s.stage.replace(/ /g, "\n"),
    size: s.value,
    fill: ["#475569", "#3b82f6", "#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#34d399", "#f43f5e"][i],
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mb-1">
          <span className="text-violet-500">▸</span>
          <span>SYSTEM / PIPELINE_ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl font-bold text-violet-400 text-glow-violet tracking-wide">
          Pipeline Architecture
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          HubSpot CRM deal flow simulation and pipeline health
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-violet-400 text-glow-violet" />
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Total Pipeline</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${(totalValue / 1000000).toFixed(2)}M</p>
        </div>
        <div className="kpi-card bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400 text-glow-emerald" />
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Avg Deal Size</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${avgDealSize.toLocaleString()}</p>
        </div>
        <div className="kpi-card bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-cyan-400 text-glow-cyan" />
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Weighted Pipeline</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${(weightedPipeline / 1000000).toFixed(2)}M</p>
        </div>
      </div>

      {/* Visual pipeline flow */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6">
        <h3 className="text-sm font-bold text-slate-300 mb-1">Pipeline Flow</h3>
        <p className="text-[10px] text-slate-600 mb-6">DEAL PROGRESSION // STAGE → STAGE</p>

        <div className="flex items-stretch gap-0 overflow-x-auto pb-2">
          {stages.map((stage, i) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageValue = stageDeals.reduce((s, d) => s + d.value, 0);
            const isExpanded = expandedStage === stage;

            return (
              <React.Fragment key={stage}>
                <button
                  onClick={() => setExpandedStage(isExpanded ? null : stage)}
                  className={`flex-1 min-w-[120px] rounded-lg border p-3 transition-all hover:scale-[1.02] ${stageColors[i]} ${
                    isExpanded ? "ring-1 ring-emerald-500/30" : ""
                  }`}
                >
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${stageTextColors[i]} mb-2`}>
                    {stage}
                  </p>
                  <p className="text-lg font-bold text-slate-200">{stageDeals.length}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    ${(stageValue / 1000).toFixed(0)}K
                  </p>
                </button>
                {i < stages.length - 1 && (
                  <div className="flex items-center px-1">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Expanded stage deals */}
        {expandedStage && (
          <div className="mt-4 border-t border-emerald-500/10 pt-4">
            <p className="text-xs text-slate-500 mb-3">
              <span className="text-emerald-400">{expandedStage}</span> — {deals.filter((d) => d.stage === expandedStage).length} deals
            </p>
            <div className="space-y-2">
              {deals
                .filter((d) => d.stage === expandedStage)
                .map((deal) => (
                  <div
                    key={deal.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 border border-emerald-500/5 text-xs"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="text-slate-300 font-medium flex-1 truncate">{deal.company}</span>
                    <span className="text-slate-500">{deal.contact}</span>
                    <span className="text-emerald-400 font-bold">${deal.value.toLocaleString()}</span>
                    <span className="text-slate-600">{deal.probability}%</span>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Clock className="w-3 h-3" />
                      {deal.daysInStage}d
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Value by stage bar chart */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-300 mb-1">Value by Stage</h3>
          <p className="text-[10px] text-slate-600 mb-6">TOTAL DEAL VALUE // PER STAGE</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" />
                <XAxis
                  dataKey="stage"
                  tick={{ fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.95)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#e2e8f0",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={24}>
                  {summary.map((_, i) => (
                    <Cell
                      key={i}
                      fill={["#475569", "#3b82f6", "#06b6d4", "#10b981", "#8b5cf6", "#f59e0b", "#34d399", "#f43f5e"][i]}
                      opacity={0.75}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deal source breakdown */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-6">
          <h3 className="text-sm font-bold text-slate-300 mb-1">Deal Sources</h3>
          <p className="text-[10px] text-slate-600 mb-6">ACQUISITION CHANNEL DISTRIBUTION</p>
          <div className="space-y-3">
            {(() => {
              const sources = deals.reduce<Record<string, { count: number; value: number }>>((acc, d) => {
                if (!acc[d.source]) acc[d.source] = { count: 0, value: 0 };
                acc[d.source].count++;
                acc[d.source].value += d.value;
                return acc;
              }, {});
              const sorted = Object.entries(sources).sort((a, b) => b[1].value - a[1].value);
              const maxValue = sorted[0]?.[1].value || 1;

              return sorted.map(([source, data]) => (
                <div key={source}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">{source}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600">{data.count} deals</span>
                      <span className="text-slate-300 font-bold">${(data.value / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500/60 to-emerald-500/60 transition-all duration-500"
                      style={{ width: `${(data.value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
