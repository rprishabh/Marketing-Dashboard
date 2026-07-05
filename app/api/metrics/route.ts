import { NextResponse } from "next/server";
import { faker } from "@faker-js/faker";

// ── Types ────────────────────────────────────────────────
interface LinkedInCampaign {
  id: string;
  name: string;
  type: "Enterprise LinkedIn Ads";
  status: "active";
  objective: string;
  dailyBudget: number;
  spend: number;
  impressions: number;
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
  followers: string;
  spend: number;
  installs: number;
  cpi: number;
  impressions: number;
  engagementRate: number;
  videoCompletionRate: number;
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
  addToCarts: number;
  costPerPurchase: number;
}

interface HistoricalPoint {
  date: string;
  [key: string]: string | number;
}

interface B2BResponse {
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

interface B2CResponse {
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

interface D2CResponse {
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

// ── Campaign Builders ────────────────────────────────────

const LINKEDIN_CAMPAIGN_NAMES = [
  "Enterprise_ABM_CXO_Targeting",
  "InMail_VP_Engineering_Outreach",
  "Sponsored_Content_Whitepaper_DL",
  "Thought_Leadership_CTO_Feed",
  "Retarget_Website_Visitors_Demo",
  "Lead_Gen_Form_Product_Tour",
  "Event_Promo_SaaS_Summit_2025",
  "Competitor_Conquest_Lookalike",
];

const TIKTOK_CAMPAIGN_NAMES = [
  "Viral_Challenge_AppLaunch",
  "Creator_Collab_Unboxing_Series",
  "Spark_Ad_TopView_GenZ",
  "In_Feed_UGC_Testimonials",
  "Branded_Effect_AR_Filter",
  "Live_Shopping_Flash_Sale",
  "Duet_Challenge_Brand_Anthem",
  "TopView_Awareness_Blast",
];

const TIKTOK_CREATORS = [
  "@digital.maven", "@techgirl.daily", "@app.explorer",
  "@lifestyle.hacks", "@trending.picks", "@mobile.guru",
  "@viral.reviews", "@content.queen",
];

const META_CATALOG_NAMES = [
  "DPA_Retarget_ViewContent",
  "Catalog_Broad_Lookalike_1pct",
  "Dynamic_Carousel_BestSellers",
  "Collection_Ad_Summer_Drop",
  "Advantage_Plus_Shopping",
  "Reels_Product_Showcase",
  "Story_Ad_Limited_Edition",
  "Checkout_Retarget_AbandonCart",
];

const META_CATALOGS = [
  "Main Product Feed", "Summer Collection 2025",
  "Best Sellers Catalog", "New Arrivals Feed",
  "Clearance Catalog", "Premium Line",
];

function buildLinkedInCampaign(): LinkedInCampaign {
  const impressions = faker.number.int({ min: 15_000, max: 800_000 });
  const ctr = faker.number.float({ min: 0.4, max: 1.8, fractionDigits: 2 });
  const clicks = Math.round(impressions * (ctr / 100));
  const leads = Math.round(clicks * faker.number.float({ min: 0.08, max: 0.22, fractionDigits: 2 }));
  const spend = faker.number.int({ min: 2_000, max: 45_000 });
  const costPerLead = parseFloat((spend / Math.max(leads, 1)).toFixed(2));

  return {
    id: faker.string.nanoid(10),
    name: faker.helpers.arrayElement(LINKEDIN_CAMPAIGN_NAMES),
    type: "Enterprise LinkedIn Ads",
    status: "active",
    objective: faker.helpers.arrayElement([
      "Lead Generation", "Website Conversions", "Brand Awareness",
      "Content Engagement", "InMail Responses",
    ]),
    dailyBudget: faker.helpers.arrayElement([100, 250, 500, 750, 1000, 1500]),
    spend,
    impressions,
    clicks,
    ctr,
    leads,
    costPerLead,
  };
}

function buildTikTokCampaign(): TikTokCampaign {
  const spend = faker.number.int({ min: 3_000, max: 60_000 });
  const cpi = faker.number.float({ min: 0.80, max: 4.50, fractionDigits: 2 });
  const installs = Math.round(spend / cpi);
  const impressions = faker.number.int({ min: 500_000, max: 15_000_000 });

  return {
    id: faker.string.nanoid(10),
    name: faker.helpers.arrayElement(TIKTOK_CAMPAIGN_NAMES),
    type: "TikTok Influencer",
    status: "active",
    creator: faker.helpers.arrayElement(TIKTOK_CREATORS),
    followers: `${faker.number.float({ min: 50, max: 850, fractionDigits: 0 })}K`,
    spend,
    installs,
    cpi,
    impressions,
    engagementRate: faker.number.float({ min: 3.5, max: 18.0, fractionDigits: 1 }),
    videoCompletionRate: faker.number.float({ min: 22, max: 68, fractionDigits: 1 }),
  };
}

function buildMetaCatalogCampaign(): MetaCatalogCampaign {
  const spend = faker.number.int({ min: 5_000, max: 80_000 });
  const roas = faker.number.float({ min: 2.0, max: 8.5, fractionDigits: 1 });
  const revenue = Math.round(spend * roas);
  const purchases = faker.number.int({ min: 120, max: 4_500 });
  const addToCarts = Math.round(purchases * faker.number.float({ min: 2.2, max: 4.5, fractionDigits: 1 }));

  return {
    id: faker.string.nanoid(10),
    name: faker.helpers.arrayElement(META_CATALOG_NAMES),
    type: "Meta Catalog Sales",
    status: "active",
    catalog: faker.helpers.arrayElement(META_CATALOGS),
    spend,
    revenue,
    roas,
    purchases,
    addToCarts,
    costPerPurchase: parseFloat((spend / purchases).toFixed(2)),
  };
}

// ── Chart Data Builders ──────────────────────────────────

function buildDates(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (count - 1) + i);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });
}

function buildB2BChart(): HistoricalPoint[] {
  return buildDates(30).map((date) => ({
    date,
    mqls: faker.number.int({ min: 8, max: 42 }),
    sqls: faker.number.int({ min: 3, max: 18 }),
    pipeline_value: faker.number.int({ min: 45_000, max: 320_000 }),
    cac: faker.number.int({ min: 95, max: 280 }),
    demos_booked: faker.number.int({ min: 1, max: 12 }),
  }));
}

function buildB2CChart(): HistoricalPoint[] {
  return buildDates(30).map((date) => ({
    date,
    dau: faker.number.int({ min: 28_000, max: 185_000 }),
    installs: faker.number.int({ min: 800, max: 6_500 }),
    cpi: faker.number.float({ min: 0.8, max: 4.2, fractionDigits: 2 }),
    retention_d7: faker.number.float({ min: 18, max: 42, fractionDigits: 1 }),
    sessions_per_user: faker.number.float({ min: 2.1, max: 5.8, fractionDigits: 1 }),
  }));
}

function buildD2CChart(): HistoricalPoint[] {
  return buildDates(30).map((date) => ({
    date,
    orders: faker.number.int({ min: 120, max: 2_800 }),
    revenue: faker.number.int({ min: 8_000, max: 180_000 }),
    aov: faker.number.float({ min: 42, max: 128, fractionDigits: 2 }),
    cart_abandonment: faker.number.float({ min: 55, max: 82, fractionDigits: 1 }),
    ad_spend: faker.number.int({ min: 2_000, max: 45_000 }),
  }));
}

// ── Deduplicator ─────────────────────────────────────────

function deduplicateByName<T extends { name: string }>(items: T[], pool: string[]): T[] {
  const seen = new Set<string>();
  for (const item of items) {
    let attempts = 0;
    while (seen.has(item.name) && attempts < pool.length) {
      item.name = pool[attempts % pool.length];
      attempts++;
    }
    seen.add(item.name);
  }
  return items;
}

// ── GET handler ──────────────────────────────────────────

export async function GET(request: Request) {
  faker.seed(Date.now());

  const { searchParams } = new URL(request.url);
  const modelParam = (searchParams.get("model") || "b2b").toLowerCase();

  const now = new Date();

  if (modelParam === "b2c") {
    // ── B2C: Mobile/App ──────────────────────────────────
    const campaigns = deduplicateByName(
      Array.from({ length: 5 }, buildTikTokCampaign),
      TIKTOK_CAMPAIGN_NAMES
    );

    const totalInstalls = campaigns.reduce((s, c) => s + c.installs, 0);
    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);

    const payload: B2CResponse = {
      model: "b2c",
      label: "Mobile/App",
      generatedAt: now.toISOString(),
      daily_active_users: faker.number.int({ min: 45_000, max: 320_000 }),
      cost_per_install: parseFloat((totalSpend / Math.max(totalInstalls, 1)).toFixed(2)),
      app_store_conversion_rate: faker.number.float({ min: 18, max: 42, fractionDigits: 1 }),
      viral_coefficient: faker.number.float({ min: 0.6, max: 1.8, fractionDigits: 2 }),
      campaigns,
      historical_chart_data: buildB2CChart(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  if (modelParam === "d2c") {
    // ── D2C: E-commerce ──────────────────────────────────
    const campaigns = deduplicateByName(
      Array.from({ length: 5 }, buildMetaCatalogCampaign),
      META_CATALOG_NAMES
    );

    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
    const totalPurchases = campaigns.reduce((s, c) => s + c.purchases, 0);

    const payload: D2CResponse = {
      model: "d2c",
      label: "E-commerce",
      generatedAt: now.toISOString(),
      average_order_value: parseFloat((totalRevenue / Math.max(totalPurchases, 1)).toFixed(2)),
      return_on_ad_spend: parseFloat((totalRevenue / Math.max(totalSpend, 1)).toFixed(1)),
      cart_abandonment_rate: faker.number.float({ min: 58, max: 82, fractionDigits: 1 }),
      customer_lifetime_value: faker.number.float({ min: 120, max: 680, fractionDigits: 2 }),
      campaigns,
      historical_chart_data: buildD2CChart(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  }

  // ── B2B: SaaS (default) ────────────────────────────────
  const campaigns = deduplicateByName(
    Array.from({ length: 5 }, buildLinkedInCampaign),
    LINKEDIN_CAMPAIGN_NAMES
  );

  const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const sqlRate = faker.number.float({ min: 28, max: 55, fractionDigits: 1 });

  const payload: B2BResponse = {
    model: "b2b",
    label: "SaaS",
    generatedAt: now.toISOString(),
    total_mqls: totalLeads + faker.number.int({ min: 20, max: 120 }),
    sql_conversion_rate: sqlRate,
    pipeline_velocity: faker.number.float({ min: 18, max: 65, fractionDigits: 1 }),
    blended_cac: parseFloat((totalSpend / Math.max(totalLeads, 1)).toFixed(2)),
    campaigns,
    historical_chart_data: buildB2BChart(),
  };

  return NextResponse.json(payload, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
