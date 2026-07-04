export const SUPABASE_FUNCTIONS_BASE =
  import.meta.env.VITE_SUPABASE_FUNCTIONS_BASE?.trim() ||
  "https://cdrobplodkxyagzyzvpq.supabase.co/functions/v1";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  "sb_publishable_cEnH7Mug8B7O8JtgSIauMw_MjlVxhW5";

export const TRADES = [
  "コーティング",
  "塗装",
  "内装",
  "足場",
  "電気",
  "設備",
  "防水",
  "左官",
  "解体",
  "清掃",
  "その他",
] as const;

export const PHOTO_TYPES = ["during", "before", "after"] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export const PHOTO_TYPE_LABELS: Record<PhotoType, string> = {
  before: "施工前",
  during: "施工中",
  after: "完了",
};

export const PHOTO_TYPE_COLORS: Record<PhotoType, string> = {
  before: "#2563eb",
  during: "#0a8f4f",
  after: "#b45309",
};

export const CHAT_QUICK_TEXTS = [
  "到着しました",
  "完了しました",
  "材料が不足しています",
  "確認お願いします",
] as const;

export const SITE_FILTERS = [
  ["all", "全部"],
  ["today", "今日"],
  ["in", "在場中"],
  ["sched", "予定"],
  ["done", "完了"],
] as const;

export type SiteFilter = (typeof SITE_FILTERS)[number][0];
