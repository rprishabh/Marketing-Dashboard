"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Info,
  XCircle,
  Clock,
  Activity,
  Workflow,
  Timer,
  Filter,
  ChevronDown,
} from "lucide-react";
import { generateInitialLogs, generateLogEntry, generateWorkflows, type LogEntry, type WorkflowNode } from "../lib/data";

const LEVEL_CONFIG = {
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "INFO" },
  success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "OK" },
  warn: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "WARN" },
  error: { icon: XCircle, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "ERR" },
};

const NODE_TYPE_STYLES: Record<string, { icon: typeof Zap; color: string; bg: string }> = {
  trigger: { icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
  action: { icon: Play, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  condition: { icon: Filter, color: "text-violet-400", bg: "bg-violet-500/10" },
  delay: { icon: Timer, color: "text-slate-400", bg: "bg-slate-500/10" },
  output: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

export default function DiagnosticsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const logContainerRef = useRef<HTMLDivElement>(null);
  const workflows = useMemo(() => generateWorkflows(), []);

  // Initialize logs
  useEffect(() => {
    setLogs(generateInitialLogs(25));
  }, []);

  // Stream new logs
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newEntry = generateLogEntry();
        return [newEntry, ...prev].slice(0, 100);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Auto-scroll
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = 0;
    }
  }, [logs]);

  const filteredLogs = levelFilter === "all" ? logs : logs.filter((l) => l.level === levelFilter);

  const logCounts = useMemo(() => {
    return logs.reduce<Record<string, number>>(
      (acc, l) => {
        acc[l.level] = (acc[l.level] || 0) + 1;
        return acc;
      },
      {}
    );
  }, [logs]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-600 font-mono mb-1">
          <span className="text-amber-500">▸</span>
          <span>SYSTEM / ENGINE_DIAGNOSTICS</span>
        </div>
        <h2 className="text-2xl font-bold text-amber-400 text-glow-amber tracking-wide">
          Engine Diagnostics
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          AI automations, workflow monitoring, and real-time log stream
        </p>
      </div>

      {/* Workflow pipelines */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Workflow className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-300">Active Workflows</h3>
          <span className="text-[10px] text-slate-600 ml-2">3 PIPELINES // REAL-TIME</span>
        </div>

        {workflows.map((pipeline, pi) => (
          <div
            key={pi}
            className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="text-xs text-slate-400 font-bold">
                WORKFLOW_{pi + 1}
              </span>
              <span className="ml-auto text-[10px] text-emerald-400/60">
                {pipeline.reduce((s, n) => s + n.executions24h, 0)} exec/24h
              </span>
            </div>

            <div className="flex items-center gap-0 overflow-x-auto pb-1">
              {pipeline.map((node, ni) => {
                const style = NODE_TYPE_STYLES[node.type];
                const Icon = style.icon;
                return (
                  <React.Fragment key={node.id}>
                    <div
                      className={`flex-shrink-0 min-w-[140px] rounded-lg border p-3 transition-all hover:scale-[1.02] ${
                        node.status === "error"
                          ? "border-rose-500/30 bg-rose-500/5"
                          : node.status === "idle"
                          ? "border-slate-700 bg-slate-800/30"
                          : `border-emerald-500/20 bg-slate-900/50 backdrop-blur-md`
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-3.5 h-3.5 ${node.status === "error" ? "text-rose-400" : style.color}`} />
                        <span className={`text-[10px] uppercase tracking-wider font-bold ${
                          node.status === "error" ? "text-rose-400" : "text-slate-500"
                        }`}>
                          {node.type}
                        </span>
                        {node.status === "error" && (
                          <span className="ml-auto w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                        )}
                        {node.status === "active" && (
                          <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full status-dot-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 font-medium truncate">{node.name}</p>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600">
                        <span>{node.executions24h} exec</span>
                        <span>{node.avgLatency}</span>
                      </div>
                    </div>
                    {ni < pipeline.length - 1 && (
                      <div className="flex-shrink-0 px-1">
                        <ArrowRight className={`w-3.5 h-3.5 ${
                          node.status === "error" ? "text-rose-500/50" : "text-emerald-500/30"
                        }`} />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Log stream */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-emerald-500/20 rounded-lg overflow-hidden">
        {/* Log header */}
        <div className="p-5 border-b border-emerald-500/10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Cpu className="w-4 h-4 text-amber-400 text-glow-amber" />
            <div>
              <h3 className="text-sm font-bold text-slate-300">System Log Stream</h3>
              <p className="text-[10px] text-slate-600 mt-0.5">
                {logs.length} ENTRIES // {isStreaming ? "STREAMING" : "PAUSED"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Level counters */}
            <div className="flex items-center gap-2 mr-2">
              {(["info", "success", "warn", "error"] as const).map((level) => {
                const cfg = LEVEL_CONFIG[level];
                return (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(levelFilter === level ? "all" : level)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      levelFilter === level ? `${cfg.bg} ${cfg.color} ring-1 ${cfg.border}` : "text-slate-600 hover:text-slate-400"
                    }`}
                  >
                    {cfg.label}
                    <span className="text-[9px] opacity-60">{logCounts[level] || 0}</span>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`p-2 rounded-lg border transition-all ${
                isStreaming
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : "border-slate-700 bg-slate-800/50 text-slate-500"
              }`}
            >
              {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setLogs(generateInitialLogs(25))}
              className="p-2 rounded-lg border border-slate-700 bg-slate-800/50 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Log entries */}
        <div
          ref={logContainerRef}
          className="max-h-[500px] overflow-y-auto divide-y divide-emerald-500/5"
        >
          {filteredLogs.map((log) => {
            const cfg = LEVEL_CONFIG[log.level];
            const Icon = cfg.icon;
            const ts = new Date(log.timestamp);

            return (
              <div
                key={log.id}
                className="flex items-start gap-3 px-5 py-3 hover:bg-emerald-500/[0.03] transition-colors animate-slide-in"
              >
                {/* Timestamp */}
                <span className="text-[10px] text-slate-600 font-mono w-[70px] flex-shrink-0 pt-0.5">
                  {ts.toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>

                {/* Level badge */}
                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${cfg.bg} ${cfg.color} w-[52px] justify-center flex-shrink-0`}
                >
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>

                {/* Source */}
                <span className="text-[11px] text-cyan-500/60 font-mono w-[130px] flex-shrink-0 truncate pt-0.5">
                  {log.source}
                </span>

                {/* Message */}
                <span className="text-xs text-slate-400 flex-1 pt-0.5">
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>

        {/* Log footer */}
        <div className="px-5 py-3 border-t border-emerald-500/10 flex items-center justify-between text-[10px] text-slate-600">
          <span>Showing {filteredLogs.length} of {logs.length} entries</span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? "bg-emerald-500 animate-pulse" : "bg-slate-600"}`} />
            {isStreaming ? "Live" : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
}
