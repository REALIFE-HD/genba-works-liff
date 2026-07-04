import type { SiteFilter } from "./constants";
import { fmtMD, jstToday } from "./format";
import type { GenbaMeResponse, GenbaSchedule, GenbaSite } from "./types";

export type SiteGroup = "in" | "today" | "tomorrow" | "sched" | "other" | "done";

export function siteById(me: GenbaMeResponse | null, id: string): GenbaSite | null {
  return me?.sites?.find((s) => s.id === id) ?? null;
}

export function siteNextSched(
  schedCache: GenbaSchedule[] | null,
  siteId: string,
): { date: string } | null {
  if (!schedCache) return null;
  const today = jstToday();
  let best: { date: string } | null = null;
  for (const s of schedCache) {
    if (s.site_id !== siteId) continue;
    for (const d of s.days ?? []) {
      if (d.status === "declined" || d.date < today) continue;
      if (!best || d.date < best.date) best = { date: d.date };
    }
  }
  return best;
}

export function workersToday(me: GenbaMeResponse | null, siteId: string): number {
  return me?.today_counts?.find((x) => x.site_id === siteId)?.workers ?? 0;
}

export function siteMeta(
  me: GenbaMeResponse | null,
  schedCache: GenbaSchedule[] | null,
  s: GenbaSite,
) {
  const t = me?.today ?? {};
  const inNow = t.site_id === s.id && t.status === "in";
  const ns = siteNextSched(schedCache, s.id);
  const today = jstToday();
  const d = new Date(`${today}T00:00:00+09:00`);
  d.setDate(d.getDate() + 1);
  const tomorrow = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
  let trade: string | null = null;
  for (const x of schedCache ?? []) {
    if (x.site_id === s.id && x.trade) {
      trade = x.trade;
      break;
    }
  }
  let group: SiteGroup;
  if (s.status === "completed") group = "done";
  else if (inNow) group = "in";
  else if (ns?.date === today) group = "today";
  else if (ns?.date === tomorrow) group = "tomorrow";
  else if (ns) group = "sched";
  else group = "other";
  return { inNow, next: ns, trade, workers: workersToday(me, s.id), group };
}

export function schedToday(schedCache: GenbaSchedule[] | null): GenbaSchedule | null {
  if (!schedCache) return null;
  const today = jstToday();
  for (const s of schedCache) {
    for (const d of s.days ?? []) {
      if (d.status !== "declined" && d.date === today) return s;
    }
  }
  return null;
}

export function nextSchedAfter(
  schedCache: GenbaSchedule[] | null,
  after: string,
): { date: string; sched: GenbaSchedule } | null {
  if (!schedCache) return null;
  let best: { date: string; sched: GenbaSchedule } | null = null;
  for (const s of schedCache) {
    for (const d of s.days ?? []) {
      if (d.status === "declined" || d.date <= after) continue;
      if (!best || d.date < best.date) best = { date: d.date, sched: s };
    }
  }
  return best;
}

export function lastUnreported(me: GenbaMeResponse | null): string | null {
  let best: string | null = null;
  for (const r of me?.history ?? []) {
    if (!r.first_in || r.has_report) continue;
    if (!best || r.date > best) best = r.date;
  }
  return best;
}

export function unreadTotal(me: GenbaMeResponse | null): number {
  return (me?.unread ?? []).reduce((n, u) => n + (u.count || 0), 0);
}

export function unreadFor(me: GenbaMeResponse | null, siteId: string): number {
  return (me?.unread ?? []).find((u) => u.site_id === siteId)?.count ?? 0;
}

export function filterSites(
  me: GenbaMeResponse | null,
  schedCache: GenbaSchedule[] | null,
  filter: SiteFilter,
  query: string,
): Map<SiteGroup, [GenbaSite, ReturnType<typeof siteMeta>][]> {
  const groups = new Map<
    SiteGroup,
    [GenbaSite, ReturnType<typeof siteMeta>][]
  >();
  const keys: SiteGroup[] = ["in", "today", "tomorrow", "sched", "other", "done"];
  keys.forEach((k) => groups.set(k, []));
  const q = query.trim().toLowerCase();
  for (const s of me?.sites ?? []) {
    if (q) {
      const hay = `${s.name} ${s.address ?? ""}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    const m = siteMeta(me, schedCache, s);
    if (filter === "today" && m.group !== "today" && !m.inNow) continue;
    if (filter === "in" && !m.inNow) continue;
    if (filter === "sched" && !["today", "tomorrow", "sched"].includes(m.group)) continue;
    if (filter === "done" && m.group !== "done") continue;
    groups.get(m.group)!.push([s, m]);
  }
  return groups;
}

export const GROUP_LABEL: Record<SiteGroup, string> = {
  in: "在場中",
  today: "今日",
  tomorrow: "明日",
  sched: "予定あり",
  other: "その他の現場",
  done: "完了した現場",
};

export function siteBadgeLabel(m: ReturnType<typeof siteMeta>): string | null {
  if (m.inNow) return "在場中";
  if (m.next) return m.next.date === jstToday() ? "今日" : fmtMD(m.next.date);
  return null;
}
