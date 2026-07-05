"use client";

import { faker } from "@faker-js/faker";

// ── Seeded for deterministic data across renders ──────────
faker.seed(42);

// ── KPI Data ──────────────────────────────────────────────
export interface KpiData {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down" | "flat";
  sparkline: number[];
}

export function generateKpiData(): KpiData[] {
  return [
    {
      label: "Total Revenue",
      value: "$2.47M",
      change: 12.4,
      trend: "up",
      sparkline: Array.from({ length: 12 }, () => faker.number.int({ min: 150, max: 280 })),
    },
    {
      label: "Active Campaigns",
      value: "34",
      change: 8.1,
      trend: "up",
      sparkline: Array.from({ length: 12 }, () => faker.number.int({ min: 20, max: 40 })),
    },
    {
      label: "Conv. Rate",
      value: "4.82%",
      change: -1.3,
      trend: "down",
      sparkline: Array.from({ length: 12 }, () => faker.number.float({ min: 3, max: 6, fractionDigits: 2 })),
    },
    {
      label: "MQL → SQL",
      value: "67.3%",
      change: 5.7,
      trend: "up",
      sparkline: Array.from({ length: 12 }, () => faker.number.float({ min: 55, max: 75, fractionDigits: 1 })),
    },
    {
      label: "CAC",
      value: "$142",
      change: -6.2,
      trend: "down",
      sparkline: Array.from({ length: 12 }, () => faker.number.int({ min: 110, max: 180 })),
    },
    {
      label: "ROAS",
      value: "4.2x",
      change: 9.8,
      trend: "up",
      sparkline: Array.from({ length: 12 }, () => faker.number.float({ min: 3, max: 5, fractionDigits: 1 })),
    },
  ];
}

// ── Ads Performance Data ──────────────────────────────────
export interface AdCampaign {
  id: string;
  platform: "google" | "meta";
  name: string;
  status: "active" | "paused" | "ended";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
}

export function generateAdCampaigns(): AdCampaign[] {
  const campaigns: AdCampaign[] = [];
  const googleNames = [
    "Brand_Search_NA", "Generic_Search_EMEA", "Performance_Max_Q3",
    "Display_Retarget_US", "YouTube_TopFunnel", "Shopping_Smart_Global",
  ];
  const metaNames = [
    "LAL_1%_Converters", "Broad_Interest_Stack", "DPA_Catalog_Retarget",
    "Reels_Brand_Awareness", "Lead_Gen_FormFill", "Conversion_ABO_Test",
  ];

  googleNames.forEach((name) => {
    campaigns.push({
      id: faker.string.nanoid(8),
      platform: "google",
      name,
      status: faker.helpers.arrayElement(["active", "active", "active", "paused"]),
      spend: faker.number.int({ min: 5000, max: 45000 }),
      impressions: faker.number.int({ min: 100000, max: 2000000 }),
      clicks: faker.number.int({ min: 3000, max: 60000 }),
      conversions: faker.number.int({ min: 80, max: 1200 }),
      cpc: faker.number.float({ min: 0.4, max: 3.5, fractionDigits: 2 }),
      ctr: faker.number.float({ min: 1.2, max: 8.5, fractionDigits: 2 }),
      roas: faker.number.float({ min: 2.0, max: 8.0, fractionDigits: 1 }),
    });
  });

  metaNames.forEach((name) => {
    campaigns.push({
      id: faker.string.nanoid(8),
      platform: "meta",
      name,
      status: faker.helpers.arrayElement(["active", "active", "paused", "ended"]),
      spend: faker.number.int({ min: 3000, max: 35000 }),
      impressions: faker.number.int({ min: 200000, max: 5000000 }),
      clicks: faker.number.int({ min: 5000, max: 120000 }),
      conversions: faker.number.int({ min: 100, max: 1500 }),
      cpc: faker.number.float({ min: 0.2, max: 2.0, fractionDigits: 2 }),
      ctr: faker.number.float({ min: 0.8, max: 5.0, fractionDigits: 2 }),
      roas: faker.number.float({ min: 1.5, max: 7.0, fractionDigits: 1 }),
    });
  });

  return campaigns;
}

export function generateAdTimeSeries(): { date: string; google: number; meta: number }[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 5, i + 1);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      google: faker.number.int({ min: 800, max: 3500 }),
      meta: faker.number.int({ min: 600, max: 2800 }),
    };
  });
}

// ── Pipeline / CRM Data ──────────────────────────────────
export interface PipelineDeal {
  id: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  daysInStage: number;
  lastActivity: string;
  source: string;
}

const PIPELINE_STAGES = [
  "Lead Captured",
  "MQL Qualified",
  "SQL Accepted",
  "Discovery Call",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export function getPipelineStages() {
  return PIPELINE_STAGES;
}

export function generatePipelineDeals(): PipelineDeal[] {
  return Array.from({ length: 28 }, () => {
    const stage = faker.helpers.arrayElement(PIPELINE_STAGES);
    const stageIndex = PIPELINE_STAGES.indexOf(stage);
    return {
      id: faker.string.nanoid(6),
      company: faker.company.name(),
      contact: faker.person.fullName(),
      value: faker.number.int({ min: 5000, max: 250000 }),
      stage,
      probability: Math.min(95, stageIndex * 15 + faker.number.int({ min: 0, max: 10 })),
      daysInStage: faker.number.int({ min: 1, max: 45 }),
      lastActivity: faker.date.recent({ days: 14 }).toLocaleDateString(),
      source: faker.helpers.arrayElement([
        "Google Ads", "Meta Ads", "Organic Search", "Referral", "LinkedIn", "Webinar",
      ]),
    };
  });
}

export function generatePipelineSummary() {
  return PIPELINE_STAGES.map((stage) => ({
    stage,
    count: faker.number.int({ min: 2, max: 18 }),
    value: faker.number.int({ min: 25000, max: 800000 }),
  }));
}

// ── Engine Diagnostics / Log Stream ──────────────────────
export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "success";
  source: string;
  message: string;
}

const LOG_SOURCES = [
  "ai.lead-scorer",
  "ai.content-gen",
  "workflow.nurture",
  "crm.sync",
  "ads.optimizer",
  "analytics.etl",
  "email.sequencer",
  "api.gateway",
];

const LOG_MESSAGES: Record<string, string[]> = {
  "ai.lead-scorer": [
    "Batch scored 142 leads — avg confidence 0.87",
    "Model v3.2 deployed, latency p99 = 23ms",
    "Feature drift detected: company_size_bucket shifted +0.4σ",
    "Re-training triggered on fresh conversion data (n=2,847)",
  ],
  "ai.content-gen": [
    "Generated 12 ad variations for Campaign_Q3_Brand",
    "A/B copy test winner: variant_C (+18% CTR)",
    "Token budget: 847K / 1M used this billing cycle",
    "Sentiment analysis complete: 94% positive tone match",
  ],
  "workflow.nurture": [
    "Drip sequence 'Enterprise_Onboard' triggered for 23 contacts",
    "Stage transition: 8 MQLs → SQL (auto-qualified)",
    "Delay node paused: awaiting sales rep assignment",
    "Webhook received from HubSpot: deal_stage_change",
  ],
  "crm.sync": [
    "Synced 1,247 records in 3.2s (delta mode)",
    "Conflict resolution: 3 duplicate contacts merged",
    "Field mapping updated: custom_score → lead_grade",
    "Connection health check: HubSpot API — 200 OK (142ms)",
  ],
  "ads.optimizer": [
    "Budget reallocation: +$420 to Brand_Search, -$420 from Display",
    "Bid strategy adjustment: target CPA → $38 (was $42)",
    "Paused underperforming ad group: CTR < 0.5% threshold",
    "Audience refresh: 12K new lookalike profiles synced",
  ],
  "analytics.etl": [
    "Pipeline run complete: 34 tables refreshed in 47s",
    "Data quality check: 99.7% completeness on attribution data",
    "Anomaly detected: traffic spike +340% from referral channel",
    "Materialized view 'funnel_metrics_daily' rebuilt",
  ],
  "email.sequencer": [
    "Batch sent: 1,892 emails — delivery rate 99.1%",
    "Open rate tracking: Campaign_July = 34.2% (above benchmark)",
    "Unsubscribe sweep: 47 contacts moved to suppression list",
    "A/B subject test concluded: 'Unlock' variant wins (+7pp)",
  ],
  "api.gateway": [
    "Rate limit approaching: 847/1000 req/min on /v2/contacts",
    "Auth token refreshed for integration: meta_marketing_api",
    "Circuit breaker tripped: google_ads_api — retrying in 30s",
    "Latency alert cleared: p95 back to normal (89ms)",
  ],
};

export function generateLogEntry(): LogEntry {
  const source = faker.helpers.arrayElement(LOG_SOURCES);
  const messages = LOG_MESSAGES[source] || ["Processing..."];
  const level = faker.helpers.weightedArrayElement([
    { value: "info" as const, weight: 50 },
    { value: "success" as const, weight: 25 },
    { value: "warn" as const, weight: 18 },
    { value: "error" as const, weight: 7 },
  ]);

  return {
    id: faker.string.nanoid(10),
    timestamp: new Date().toISOString(),
    level,
    source,
    message: faker.helpers.arrayElement(messages),
  };
}

export function generateInitialLogs(count: number = 20): LogEntry[] {
  return Array.from({ length: count }, () => {
    const entry = generateLogEntry();
    entry.timestamp = faker.date.recent({ days: 1 }).toISOString();
    return entry;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ── Workflow nodes ───────────────────────────────────────
export interface WorkflowNode {
  id: string;
  name: string;
  type: "trigger" | "action" | "condition" | "delay" | "output";
  status: "active" | "idle" | "error";
  executions24h: number;
  avgLatency: string;
}

export function generateWorkflows(): WorkflowNode[][] {
  return [
    [
      { id: "w1-1", name: "New Lead Webhook", type: "trigger", status: "active", executions24h: 347, avgLatency: "12ms" },
      { id: "w1-2", name: "AI Lead Scoring", type: "action", status: "active", executions24h: 347, avgLatency: "89ms" },
      { id: "w1-3", name: "Score ≥ 80?", type: "condition", status: "active", executions24h: 347, avgLatency: "2ms" },
      { id: "w1-4", name: "Assign to Sales", type: "action", status: "active", executions24h: 142, avgLatency: "34ms" },
      { id: "w1-5", name: "CRM Update", type: "output", status: "active", executions24h: 142, avgLatency: "67ms" },
    ],
    [
      { id: "w2-1", name: "Daily 06:00 UTC", type: "trigger", status: "active", executions24h: 1, avgLatency: "0ms" },
      { id: "w2-2", name: "Pull Ad Metrics", type: "action", status: "active", executions24h: 1, avgLatency: "2.3s" },
      { id: "w2-3", name: "ROAS < 2x?", type: "condition", status: "active", executions24h: 1, avgLatency: "4ms" },
      { id: "w2-4", name: "Pause Campaign", type: "action", status: "idle", executions24h: 0, avgLatency: "—" },
      { id: "w2-5", name: "Slack Alert", type: "output", status: "active", executions24h: 1, avgLatency: "210ms" },
    ],
    [
      { id: "w3-1", name: "Form Submission", type: "trigger", status: "active", executions24h: 89, avgLatency: "8ms" },
      { id: "w3-2", name: "Enrich Contact", type: "action", status: "active", executions24h: 89, avgLatency: "1.2s" },
      { id: "w3-3", name: "Wait 2 Hours", type: "delay", status: "active", executions24h: 67, avgLatency: "2h" },
      { id: "w3-4", name: "Send Welcome Email", type: "action", status: "error", executions24h: 54, avgLatency: "340ms" },
      { id: "w3-5", name: "Add to Nurture", type: "output", status: "active", executions24h: 54, avgLatency: "23ms" },
    ],
  ];
}
