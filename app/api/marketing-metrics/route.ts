import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

// ── Types ────────────────────────────────────────────────
interface Campaign {
  id: string;
  name: string;
  platform: "google" | "meta";
  status: "active" | "learning" | "limited";
  objective: string;
  dailyBudget: number;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  conversions: number;
  costPerConversion: number;
  roas: number;
}

interface WeeklyMqlBreakdown {
  channel: string;
  count: number;
  qualityScore: number;
}

interface TrafficPoint {
  date: string;
  sessions: number;
  pageviews: number;
  bounceRate: number;
}

interface SpendRoiEntry {
  channel: string;
  spend: number;
  revenue: number;
  roi: number;
}

interface MonthlyPerformance {
  period: string;
  generatedAt: string;
  businessModel: string;
  overview: {
    ctr: number;
    ctrBenchmark: number;
    ctrDelta: number;
    blendedCac: number;
    cacTarget: number;
    cacTrend: "improving" | "stable" | "worsening";
    totalSpend: number;
    totalRevenue: number;
    roas: number;
    costPerClick: number;
    conversionRate: number;
  };
  mqls: {
    totalThisWeek: number;
    weekOverWeekChange: number;
    mtdTotal: number;
    monthlyTarget: number;
    pacePercentage: number;
    qualifiedRate: number;
    breakdown: WeeklyMqlBreakdown[];
  };
  activeCampaigns: Campaign[];
  trafficTrend: TrafficPoint[];
  spendVsRoi: SpendRoiEntry[];
  funnel: {
    impressions: number;
    clicks: number;
    landingPageViews: number;
    formSubmissions: number;
    mqls: number;
    sqls: number;
    opportunities: number;
    closedWon: number;
  };
}

// ── Helpers & Campaign Pools ──────────────────────────────
const CAMPAIGNS_POOL = {
  B2B: {
    google: [
      "B2B_Search_Enterprise",
      "SaaS_LeadGen_Demo",
      "PMax_B2B_Prospects",
      "Display_ABM_Targeting",
      "YouTube_B2B_CaseStudy",
    ],
    meta: [
      "B2B_LAL_Match",
      "B2B_Broad_CXO_Stack",
      "Meta_Lead_Whitepaper",
      "B2B_Carousel_Testimonials",
      "B2B_Retargeting_Pricing",
    ],
    channels: [
      "Google Search",
      "Meta Ads",
      "Organic Search",
      "LinkedIn Ads",
      "Webinar Registrations",
      "Content Syndication",
      "Referral Program",
      "Direct / Branded",
    ],
    objectives: ["Lead Gen", "Demo Request", "Trial Start", "Conversions"],
  },
  B2C: {
    google: [
      "B2C_Search_Brand",
      "B2C_Subscription_SaaS",
      "PMax_B2C_Signups",
      "Display_Audience_Interest",
      "YouTube_Creator_Collab",
    ],
    meta: [
      "B2C_Instagram_Stories",
      "B2C_Broad_Interests",
      "TikTok_Style_Video_Ads",
      "B2C_Retargeting_Trial",
      "B2C_Offer_Discount",
    ],
    channels: [
      "Google Search",
      "Meta Ads",
      "TikTok Ads",
      "YouTube Ads",
      "Affiliate Networks",
      "Email Campaigns",
      "Organic Search",
      "Referrals",
    ],
    objectives: ["Free Trial", "Signups", "App Installs", "Conversions"],
  },
  D2C: {
    google: [
      "D2C_Shopping_Smart",
      "D2C_Brand_Search",
      "D2C_PMax_Products",
      "D2C_Display_Visual",
      "D2C_YouTube_Unboxing",
    ],
    meta: [
      "D2C_Instagram_Shop",
      "D2C_Reels_Video_Haul",
      "D2C_DPA_Catalog",
      "D2C_LAL_AddtoCart",
      "D2C_Influencer_Creative",
    ],
    channels: [
      "Google Shopping",
      "Instagram Shop",
      "TikTok Shop",
      "Pinterest Ads",
      "Affiliate Partners",
      "Influencer Codes",
      "Email Flows",
      "SMS Alerts",
    ],
    objectives: ["Purchase", "Add To Cart", "Store Sale", "Conversions"],
  },
};

function buildCampaign(platform: "google" | "meta", model: "B2B" | "B2C" | "D2C"): Campaign {
  const pool = CAMPAIGNS_POOL[model];
  const name = faker.helpers.arrayElement(platform === "google" ? pool.google : pool.meta);
  
  // High-performance B2C/D2C campaigns get slightly higher impressions
  const maxImpressions = model === "B2B" ? 1_500_000 : model === "B2C" ? 3_000_000 : 4_500_000;
  const minImpressions = model === "B2B" ? 30_000 : model === "B2C" ? 100_000 : 250_000;
  const impressions = faker.number.int({ min: minImpressions, max: maxImpressions });
  
  // MUST: CTR between 1.5% and 3.2%
  const ctr = faker.number.float({ min: 1.5, max: 3.2, fractionDigits: 2 });
  const clicks = Math.round(impressions * (ctr / 100));

  // CAC & CPC structure varies by Business Model
  let cpcMin = 1.0;
  let cpcMax = 5.0;
  let convRateMin = 1.0;
  let convRateMax = 4.0;
  let revenueMultiplier = 1500;

  if (model === "B2C") {
    cpcMin = 0.4;
    cpcMax = 2.0;
    convRateMin = 3.0;
    convRateMax = 7.0;
    revenueMultiplier = 180;
  } else if (model === "D2C") {
    cpcMin = 0.15;
    cpcMax = 1.0;
    convRateMin = 5.0;
    convRateMax = 12.0;
    revenueMultiplier = 75;
  }

  const cpc = faker.number.float({
    min: platform === "google" ? cpcMin * 1.3 : cpcMin,
    max: platform === "google" ? cpcMax * 1.3 : cpcMax,
    fractionDigits: 2,
  });
  
  const spend = Math.round(clicks * cpc);
  const conversionRate = faker.number.float({ min: convRateMin, max: convRateMax, fractionDigits: 2 });
  const conversions = Math.max(1, Math.round(clicks * (conversionRate / 100)));
  const costPerConversion = parseFloat((spend / conversions).toFixed(2));
  const revenue = conversions * faker.number.int({ min: revenueMultiplier * 0.7, max: revenueMultiplier * 1.4 });
  const roas = parseFloat((revenue / spend).toFixed(1));

  return {
    id: faker.string.nanoid(10),
    name,
    platform,
    status: faker.helpers.weightedArrayElement([
      { value: "active" as const, weight: 75 },
      { value: "learning" as const, weight: 15 },
      { value: "limited" as const, weight: 10 },
    ]),
    objective: faker.helpers.arrayElement(pool.objectives),
    dailyBudget: faker.helpers.arrayElement([50, 100, 200, 400, 800, 1200]),
    spend,
    impressions,
    clicks,
    ctr,
    cpc,
    conversions,
    costPerConversion,
    roas,
  };
}

// ── GET handler ──────────────────────────────────────────
export async function GET(request: Request) {
  // Fresh seed
  faker.seed(Date.now());

  const { searchParams } = new URL(request.url);
  const modelParam = searchParams.get("model") || "B2B";
  const model: "B2B" | "B2C" | "D2C" = (modelParam === "B2B" || modelParam === "B2C" || modelParamParamCheck(modelParam))
    ? modelParam as "B2B" | "B2C" | "D2C"
    : "B2B";

  function modelParamParamCheck(val: string): val is "B2B" | "B2C" | "D2C" {
    return val === "B2B" || val === "B2C" || val === "D2C";
  }

  const now = new Date();
  const period = now.toLocaleDateString("en-US", { year: "numeric", month: "long" });

  // ── Active Campaigns (5 Google + 5 Meta) ───────────────
  const activeCampaigns: Campaign[] = [
    ...Array.from({ length: 5 }, () => buildCampaign("google", model)),
    ...Array.from({ length: 5 }, () => buildCampaign("meta", model)),
  ];

  // Deduplicate names within each platform
  const seen = new Set<string>();
  const pool = CAMPAIGNS_POOL[model];
  for (const c of activeCampaigns) {
    let index = 0;
    while (seen.has(`${c.platform}:${c.name}`)) {
      const namesList = c.platform === "google" ? pool.google : pool.meta;
      c.name = namesList[index % namesList.length];
      index++;
    }
    seen.add(`${c.platform}:${c.name}`);
  }

  // ── Aggregated overview ────────────────────────────────
  const totalSpend = activeCampaigns.reduce((s, c) => s + c.spend, 0);
  const totalClicks = activeCampaigns.reduce((s, c) => s + c.clicks, 0);
  const totalImpressions = activeCampaigns.reduce((s, c) => s + c.impressions, 0);
  const totalConversions = activeCampaigns.reduce((s, c) => s + c.conversions, 0);
  const ctr = parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2));
  const ctrBenchmark = 2.15;
  const blendedCac = parseFloat((totalSpend / totalConversions).toFixed(2));

  // Determine CAC targets based on model
  let cacTarget = 150;
  if (model === "B2C") cacTarget = 45;
  if (model === "D2C") cacTarget = 20;

  const totalRevenue = activeCampaigns.reduce((s, c) => s + (c.spend * c.roas), 0);

  // ── MQLs / Signups this week breakdown ─────────────────
  const mqlBreakdown: WeeklyMqlBreakdown[] = pool.channels.map((channel) => {
    let countMin = 5;
    let countMax = 50;
    if (model === "B2C") { countMin = 40; countMax = 350; }
    if (model === "D2C") { countMin = 250; countMax = 1800; }
    
    return {
      channel,
      count: faker.number.int({ min: countMin, max: countMax }),
      qualityScore: faker.number.float({ min: 0.45, max: 0.95, fractionDigits: 2 }),
    };
  });
  
  const totalMqlsThisWeek = mqlBreakdown.reduce((s, b) => s + b.count, 0);
  const monthlyTarget = model === "B2B" ? 1200 : model === "B2C" ? 8000 : 45000;
  const weekOfMonth = Math.ceil(now.getDate() / 7);
  const mtdTotal = totalMqlsThisWeek * weekOfMonth + faker.number.int({ min: -30, max: 30 });

  // ── Funnel metrics ─────────────────────────────────────
  const funnelImpressions = totalImpressions;
  const funnelClicks = totalClicks;
  const lpViews = Math.round(funnelClicks * faker.number.float({ min: 0.85, max: 0.97, fractionDigits: 2 }));
  
  // Rate changes based on business models (D2C shopping is fast, B2B has high drop-off)
  const formSubRate = model === "B2B" ? 0.08 : model === "B2C" ? 0.15 : 0.25;
  const mqlRate = model === "B2B" ? 0.65 : model === "B2C" ? 0.75 : 0.82;
  const sqlRate = model === "B2B" ? 0.42 : model === "B2C" ? 0.55 : 0.68;
  const oppRate = model === "B2B" ? 0.50 : model === "B2C" ? 0.60 : 0.70;
  const wonRate = model === "B2B" ? 0.28 : model === "B2C" ? 0.35 : 0.48;

  const formSubs = Math.round(lpViews * formSubRate);
  const mqls = Math.round(formSubs * mqlRate);
  const sqls = Math.round(mqls * sqlRate);
  const opps = Math.round(sqls * oppRate);
  const closedWon = Math.round(opps * wonRate);

  // ── Traffic trend (30 days) ─────────────────────────────
  const trafficTrend: TrafficPoint[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - 29 + i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Scale sessions depending on model
    const multiplier = model === "B2B" ? 1 : model === "B2C" ? 4 : 10;
    const baseMin = (isWeekend ? 1200 : 3400) * multiplier;
    const baseMax = (isWeekend ? 2800 : 7200) * multiplier;

    const baseSessions = faker.number.int({ min: baseMin, max: baseMax });
    const pagesPerSession = faker.number.float({ min: 2.1, max: 4.8, fractionDigits: 1 });
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sessions: baseSessions,
      pageviews: Math.round(baseSessions * pagesPerSession),
      bounceRate: faker.number.float({ min: 32, max: 58, fractionDigits: 1 }),
    };
  });

  // ── Spend vs ROI by channel ────────────────────────────
  const spendVsRoi: SpendRoiEntry[] = pool.channels.slice(0, 6).map((channel) => {
    const spend = faker.number.int({ min: 10_000, max: 80_000 });
    // D2C gets slightly lower ROAS multiplier but huge volume, B2B has higher variance
    const roiMin = model === "B2B" ? 1.5 : model === "B2C" ? 2.0 : 1.8;
    const roiMax = model === "B2B" ? 8.0 : model === "B2C" ? 6.5 : 5.0;
    const roi = faker.number.float({ min: roiMin, max: roiMax, fractionDigits: 1 });
    return {
      channel,
      spend,
      revenue: Math.round(spend * roi),
      roi,
    };
  });

  // ── Assemble response ──────────────────────────────────
  const payload: MonthlyPerformance = {
    period,
    generatedAt: now.toISOString(),
    businessModel: model,
    overview: {
      ctr,
      ctrBenchmark,
      ctrDelta: parseFloat((ctr - ctrBenchmark).toFixed(2)),
      blendedCac,
      cacTarget,
      cacTrend: faker.helpers.weightedArrayElement([
        { value: "improving" as const, weight: 45 },
        { value: "stable" as const, weight: 40 },
        { value: "worsening" as const, weight: 15 },
      ]),
      totalSpend: Math.round(totalSpend),
      totalRevenue: Math.round(totalRevenue),
      roas: parseFloat((totalRevenue / totalSpend).toFixed(1)),
      costPerClick: parseFloat((totalSpend / totalClicks).toFixed(2)),
      conversionRate: parseFloat(((totalConversions / totalClicks) * 100).toFixed(2)),
    },
    mqls: {
      totalThisWeek: totalMqlsThisWeek,
      weekOverWeekChange: faker.number.float({ min: -10.0, max: 25.0, fractionDigits: 1 }),
      mtdTotal,
      monthlyTarget,
      pacePercentage: parseFloat(((mtdTotal / monthlyTarget) * 100).toFixed(1)),
      qualifiedRate: parseFloat(
        (mqlBreakdown.reduce((s, b) => s + b.qualityScore, 0) / mqlBreakdown.length).toFixed(2)
      ),
      breakdown: mqlBreakdown,
    },
    activeCampaigns,
    trafficTrend,
    spendVsRoi,
    funnel: {
      impressions: funnelImpressions,
      clicks: funnelClicks,
      landingPageViews: lpViews,
      formSubmissions: formSubs,
      mqls,
      sqls,
      opportunities: opps,
      closedWon,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
