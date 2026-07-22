import { HardHat, MapPin, Navigation, Search } from "lucide-react";
import { useGenba } from "../context/GenbaContext";
import { EmptyState } from "../components/ui/Card";
import { SITE_FILTERS } from "../lib/constants";
import { fmtTime, navUrl } from "../lib/format";
import {
  filterSites,
  GROUP_LABEL,
  siteBadgeLabel,
  type SiteGroup,
} from "../lib/site-helpers";

const GROUP_DOT: Record<SiteGroup, string> = {
  in: "#0a8f4f",
  today: "#f59e0b",
  tomorrow: "#2563eb",
  sched: "#94a3b8",
  other: "#cbd2d8",
  done: "#94a3b8",
};

export function SitesPage() {
  const {
    me,
    schedCache,
    siteFilter,
    siteQuery,
    doneOpen,
    setSiteFilter,
    setSiteQuery,
    setDoneOpen,
    openSite,
  } = useGenba();

  const groups = filterSites(me, schedCache, siteFilter, siteQuery);
  const order: SiteGroup[] = ["in", "today", "tomorrow", "sched", "other", "done"];
  const hasAny = (me?.sites?.length ?? 0) > 0;
  const filteredCount = order.reduce((n, g) => n + (groups.get(g)?.length ?? 0), 0);

  return (
    <div>
      <div className="mb-3 px-1">
        <h2 className="text-[17px] font-extrabold text-[#14181b]">現場</h2>
        <p className="mt-0.5 text-[12px] font-semibold text-[#6b7280]">
          予定・在場中の現場を確認
        </p>
      </div>
      <div className="relative mb-2.5">
        <Search className="absolute top-3.5 left-3 h-4 w-4 text-[#9aa4ad]" />
        <input
          value={siteQuery}
          onChange={(e) => setSiteQuery(e.target.value)}
          placeholder="現場名・住所で検索"
          className="w-full rounded-xl border border-[#e6eaee] bg-white py-3 pr-3 pl-9 text-base"
        />
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {SITE_FILTERS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSiteFilter(key)}
            className={`rounded-full px-4 py-2 text-[12.5px] font-bold ${
              siteFilter === key
                ? "bg-[#14181b] text-white"
                : "bg-white text-[#6b7280] shadow-[inset_0_0_0_1px_#e6eaee]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {!hasAny ? (
        <EmptyState
          icon={<HardHat className="h-6 w-6" strokeWidth={2.2} />}
          title="表示できる現場がありません"
          body="予定登録や打刻があるとここに現場が一覧表示されます。"
        />
      ) : filteredCount === 0 ? (
        <EmptyState
          icon={<Search className="h-6 w-6" strokeWidth={2.2} />}
          title="条件に合う現場がありません"
          body="フィルタや検索を変えてみてください。"
          actionLabel="全部を表示"
          onAction={() => {
            setSiteFilter("all");
            setSiteQuery("");
          }}
        />
      ) : (
        order.map((g) => {
          const arr = groups.get(g) ?? [];
          if (!arr.length) return null;
          return (
            <div key={g}>
              <h4 className="mb-2 mt-1.5 flex items-center px-1 text-xs font-extrabold text-[#6b7280]">
                <span
                  className="mr-1.5 inline-block h-2 w-2 rounded-full"
                  style={{ background: GROUP_DOT[g] }}
                />
                {GROUP_LABEL[g].replace(/^.*?\s/, "")}
              </h4>
              {g === "done" && siteFilter !== "done" && !doneOpen ? (
                <button
                  type="button"
                  onClick={() => setDoneOpen(true)}
                  className="mb-2.5 w-full rounded-2xl border border-dashed border-[#e6eaee] bg-white py-3 text-center text-[13px] font-bold text-[#6b7280]"
                >
                  {arr.length}件を見る
                </button>
              ) : (
                arr.map(([s, m]) => {
                  const badge = siteBadgeLabel(m);
                  const t = me?.today ?? {};
                  const sub: string[] = [];
                  if (s.address) sub.push(s.address);
                  if (m.trade) sub.push(m.trade);
                  if (m.workers) sub.push("職人 " + m.workers + "人");
                  if (m.inNow && t.first_in) sub.push(fmtTime(t.first_in) + "〜");
                  return (
                    <div
                      key={s.id}
                      role="button"
                      onClick={() => openSite(s.id)}
                      className="mb-2.5 flex cursor-pointer items-center gap-3 rounded-[20px] border border-[#e6eaee] bg-white p-3.5 shadow-sm active:bg-[#f8faf9]"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f3f5] text-[#6b7280]">
                        <MapPin className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-[15px] leading-snug font-extrabold">
                          {s.name}
                          {badge && (
                            <span
                              className={`ml-1.5 inline-block rounded-full px-2 py-0.5 align-[1.5px] text-[10px] font-extrabold whitespace-nowrap ${
                                m.inNow
                                  ? "bg-[#e7f8ef] text-[#0a8f4f]"
                                  : "bg-[#fff7e6] text-[#b45309]"
                              }`}
                            >
                              {badge}
                            </span>
                          )}
                        </span>
                        {sub.length > 0 && (
                          <span className="mt-0.5 block truncate text-[11.5px] leading-snug text-[#6b7280]">
                            {sub.join(" · ")}
                          </span>
                        )}
                      </span>
                      {s.address ? (
                        <a
                          href={navUrl(s.address)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="ナビ"
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#cfe3fa] bg-[#eef6ff] text-[#2563eb]"
                        >
                          <Navigation className="h-4 w-4" />
                        </a>
                      ) : (
                        <span className="shrink-0 text-[#cbd2d8]">›</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
