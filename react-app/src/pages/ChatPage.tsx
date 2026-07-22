import { useMemo, useState } from "react";
import { HardHat, MessageCircle } from "lucide-react";
import { BackBtn, EmptyState } from "../components/ui/Card";
import { ChatPanel } from "../components/ChatPanel";
import { DmPanel } from "../components/DmPanel";
import { useGenba } from "../context/GenbaContext";
import { unreadFor } from "../lib/site-helpers";
import type { GenbaSite } from "../lib/types";

export function ChatPage() {
  const { me, chatSiteId, setChatSiteId, setTab } = useGenba();
  const [mode, setMode] = useState<"site" | "dm">("site");

  const activeSite = useMemo(
    () => me?.sites?.find((s) => s.id === chatSiteId) ?? null,
    [me?.sites, chatSiteId],
  );

  return (
    <div>
      <div className="mb-3 px-1">
        <h2 className="text-[17px] font-extrabold text-[#14181b]">チャット</h2>
        <p className="mt-0.5 text-[12px] font-semibold text-[#6b7280]">
          現場の連絡と個人メッセージ
        </p>
      </div>
      <div className="mb-3 flex rounded-2xl border border-[#e6eaee] bg-[#f1f4f2] p-1">
        <button
          type="button"
          onClick={() => setMode("site")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-extrabold transition-colors ${
            mode === "site" ? "bg-white text-[#14181b] shadow-sm" : "text-[#6b7280]"
          }`}
        >
          現場
        </button>
        <button
          type="button"
          onClick={() => setMode("dm")}
          className={`flex-1 rounded-xl py-2.5 text-[13px] font-extrabold transition-colors ${
            mode === "dm" ? "bg-white text-[#14181b] shadow-sm" : "text-[#6b7280]"
          }`}
        >
          個人
        </button>
      </div>
      {mode === "site" ? (
        chatSiteId ? (
          <div>
            <BackBtn
              onClick={() => setChatSiteId(null)}
              label="一覧へ"
            />
            <div className="mb-2.5 px-1">
              <p className="truncate text-[15px] font-extrabold text-[#14181b]">
                {activeSite?.name ?? "現場連絡"}
              </p>
              {activeSite?.address && (
                <p className="truncate text-[11.5px] font-semibold text-[#6b7280]">
                  {activeSite.address}
                </p>
              )}
            </div>
            <ChatPanel
              siteId={chatSiteId}
              siteName={activeSite?.name}
            />
          </div>
        ) : (
          <SiteChatList
            onOpen={(id) => setChatSiteId(id)}
            onGoSites={() => setTab("sites")}
          />
        )
      ) : (
        <DmPanel />
      )}
    </div>
  );
}

function SiteChatList({
  onOpen,
  onGoSites,
}: {
  onOpen: (siteId: string) => void;
  onGoSites: () => void;
}) {
  const { me } = useGenba();
  const todayId = me?.today?.site_id ?? null;

  const sites = useMemo(() => {
    const list = [...(me?.sites ?? [])];
    list.sort((a, b) => {
      const aToday = a.id === todayId ? 0 : 1;
      const bToday = b.id === todayId ? 0 : 1;
      if (aToday !== bToday) return aToday - bToday;
      const aUnread = unreadFor(me, a.id) > 0 ? 0 : 1;
      const bUnread = unreadFor(me, b.id) > 0 ? 0 : 1;
      if (aUnread !== bUnread) return aUnread - bUnread;
      return a.name.localeCompare(b.name, "ja");
    });
    return list;
  }, [me, todayId]);

  if (!sites.length) {
    return (
      <EmptyState
        icon={<HardHat className="h-6 w-6" strokeWidth={2.2} />}
        title="まだ現場がありません"
        body="現場に予定が入るか、打刻するとここに連絡スレッドが表示されます。"
        actionLabel="現場を確認する"
        onAction={onGoSites}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e6eaee] bg-white shadow-sm">
      {sites.map((s, i) => (
        <SiteChatRow
          key={s.id}
          site={s}
          unread={unreadFor(me, s.id)}
          isToday={s.id === todayId}
          divider={i > 0}
          onOpen={() => onOpen(s.id)}
        />
      ))}
    </div>
  );
}

function SiteChatRow({
  site,
  unread,
  isToday,
  divider,
  onOpen,
}: {
  site: GenbaSite;
  unread: number;
  isToday: boolean;
  divider: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`flex w-full items-center gap-3 px-3.5 py-3.5 text-left active:bg-[#f6f8f7] ${
        divider ? "border-t border-[#eef1f3]" : ""
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e7f8ef] text-[#06c755]">
        <MessageCircle className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[15px] font-extrabold text-[#14181b]">
            {site.name}
          </span>
          {isToday && (
            <span className="shrink-0 rounded-full bg-[#e7f8ef] px-1.5 py-0.5 text-[10px] font-extrabold text-[#0a8f4f]">
              今日
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12px] font-semibold text-[#6b7280]">
          {site.address || "現場の連絡スレッド"}
        </span>
      </span>
      {unread > 0 ? (
        <span className="shrink-0 rounded-full bg-[#e8453c] px-2 py-0.5 text-[11px] font-extrabold text-white">
          {unread > 99 ? "99+" : unread}
        </span>
      ) : (
        <span className="shrink-0 text-[#c5ccd2]">›</span>
      )}
    </button>
  );
}
