import { CalendarDays, MessageCircle } from "lucide-react";
import { useGenba } from "../context/GenbaContext";
import { BackBtn, Card, EmptyState, Section } from "../components/ui/Card";
import { fmtTime } from "../lib/format";

export function MyPage() {
  const { me, displayName, setTab, go } = useGenba();
  const name = me?.worker?.name || displayName || "職人";
  const month = me?.month ?? {};
  const history = me?.history ?? [];

  return (
    <div>
      <BackBtn onClick={() => go("home")} label="ホームへ" />

      <Card className="flex items-center gap-3 !py-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#06c755] text-xl font-extrabold text-white">
          {name.trim().slice(0, 1)}
        </span>
        <span className="min-w-0">
          <span className="block text-[17px] font-extrabold">{name}</span>
          <span className="text-[13.5px] text-[#6b7280]">現場WORKS 職人アカウント</span>
        </span>
      </Card>

      <button
        type="button"
        onClick={() => go("chat")}
        className="mb-4 flex w-full items-center gap-3 rounded-[20px] border border-[#e6eaee] bg-white p-4 text-left shadow-sm active:bg-[#f8faf9]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef6ff] text-[#185fa5]">
          <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-extrabold">個人メッセージ</span>
          <span className="block text-[13px] font-semibold text-[#6b7280]">
            職人どうしの1対1の連絡
          </span>
        </span>
        <span className="shrink-0 text-[#c5ccd2]">›</span>
      </button>

      <Section>今月の出面</Section>
      <div className="mb-4 grid grid-cols-3 gap-2.5">
        {[
          ["ninku", "人工"],
          ["hours", "稼働h"],
          ["days", "出勤日"],
        ].map(([key, label]) => (
          <div
            key={key}
            className="rounded-2xl border border-[#e6eaee] bg-white px-2 py-3.5 text-center shadow-sm"
          >
            <div className="text-2xl font-extrabold tabular-nums">
              {month[key as keyof typeof month] ?? "–"}
            </div>
            <div className="mt-0.5 text-[12.5px] font-semibold text-[#6b7280]">{label}</div>
          </div>
        ))}
      </div>

      <Section>日別履歴</Section>
      {!history.length ? (
        <EmptyState
          icon={<CalendarDays className="h-6 w-6" strokeWidth={2.2} />}
          title="まだ記録がありません"
          body="現場で打刻すると、ここに日別の出面が表示されます。"
          actionLabel="現場を見る"
          onAction={() => setTab("sites")}
        />
      ) : (
        <Card>
          {history.map((r) => {
            const color = r.last_out
              ? "#0a8f4f"
              : r.first_in
                ? "#06c755"
                : "#cbd2d8";
            const dd = r.date.slice(8) + "日";
            return (
              <div
                key={r.date}
                className="flex items-center gap-3 border-b border-[#eef1f3] py-3 last:border-0"
              >
                <span className="w-[50px] text-[15px] font-extrabold">{dd}</span>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                <span className="text-[14px] tabular-nums text-[#6b7280]">
                  {fmtTime(r.first_in)} → {r.last_out ? fmtTime(r.last_out) : "在場中"}
                </span>
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-[12px] font-extrabold ${
                    r.has_report
                      ? "bg-[#e7f8ef] text-[#0a8f4f]"
                      : "bg-[#fdecea] text-[#e8453c]"
                  }`}
                >
                  {r.has_report ? "日報済" : "日報未"}
                </span>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
