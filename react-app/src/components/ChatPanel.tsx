import { useEffect, useRef, useState } from "react";
import { useGenba } from "../context/GenbaContext";
import { CHAT_QUICK_TEXTS } from "../lib/constants";
import type { ChatMessage } from "../lib/types";

export function ChatPanel({
  siteId,
  siteName,
}: {
  siteId?: string;
  siteName?: string;
}) {
  const { loadChat, sendChat, chatSiteId, setTab, view, siteTab } = useGenba();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mine, setMine] = useState<string | undefined>();
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [resolvedSite, setResolvedSite] = useState(siteName ?? "");
  const sinceRef = useRef<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const sid = siteId ?? chatSiteId;
  const stickyComposer =
    (view === "site" && siteTab === "chat") ||
    (view === "chat" && !!chatSiteId);

  useEffect(() => {
    sinceRef.current = null;
    setMessages([]);
    setError(null);
    setSendError(null);
  }, [sid]);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const j = await loadChat(sinceRef.current, sid);
        if (cancelled) return;
        if (!j.ok) {
          const errMap: Record<string, string> = {
            no_site_today:
              "本日の現場に入場すると、その現場のチャットが使えます。",
            not_member:
              "この現場のチャットには参加できません（この現場での打刻、または自社の予定登録が必要です）。",
            worker_not_found: "先に登録してください。",
          };
          setError(errMap[j.error ?? ""] ?? "読込に失敗しました");
          return;
        }
        setError(null);
        setMine(j.mine);
        if (j.site_name) setResolvedSite(j.site_name);
        if (j.messages.length) {
          setMessages((prev) => {
            const next = sinceRef.current ? [...prev, ...j.messages] : j.messages;
            return next;
          });
          sinceRef.current = j.messages[j.messages.length - 1].created_at;
          requestAnimationFrame(() => {
            if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
          });
        } else if (!sinceRef.current) {
          setMessages([]);
        }
      } catch {
        /* ignore */
      }
    };
    void poll();
    const t = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [loadChat, sid]);

  const handleSend = async () => {
    const v = input.trim();
    if (!v) return;
    setInput("");
    setSendError(null);
    try {
      await sendChat(v, sid);
      sinceRef.current = null;
      setMessages([]);
      const j = await loadChat(null, sid);
      if (j.ok && j.messages.length) {
        setMessages(j.messages);
        sinceRef.current = j.messages[j.messages.length - 1].created_at;
        requestAnimationFrame(() => {
          if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
        });
      }
    } catch {
      setInput(v);
      setSendError("送信に失敗しました。もう一度お試しください。");
    }
  };

  const composer = (
    <>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5">
        {CHAT_QUICK_TEXTS.map((txt) => (
          <button
            key={txt}
            type="button"
            onClick={() => setInput(txt)}
            className="shrink-0 rounded-full border border-[#e6eaee] bg-white px-3.5 py-2 text-[12.5px] font-bold whitespace-nowrap"
          >
            {txt}
          </button>
        ))}
      </div>
      {sendError && (
        <p className="mt-1.5 text-center text-[12px] font-bold text-[#cf3a31]">{sendError}</p>
      )}
      <div className="mt-2 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void handleSend()}
          placeholder="メッセージを入力"
          className="flex-1 rounded-xl border border-[#e6eaee] px-3 py-3 text-[15px]"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          className="rounded-2xl bg-[#06c755] px-4 py-3 text-sm font-extrabold text-white"
        >
          送信
        </button>
      </div>
    </>
  );

  return (
    <div className={stickyComposer ? "pb-[calc(8.5rem+env(safe-area-inset-bottom))]" : ""}>
      {!siteId && (
        <p className="mb-2.5 px-1 text-xs font-semibold text-[#6b7280]">
          現場：{resolvedSite || "…"}
        </p>
      )}
      <div
        ref={boxRef}
        className={`flex flex-col gap-2 overflow-auto rounded-2xl border border-[#e6eaee] bg-white p-3 ${
          stickyComposer
            ? "min-h-[40vh] max-h-[calc(100dvh-14rem)]"
            : "min-h-[280px] max-h-[54vh]"
        }`}
      >
        {error ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <p className="px-2 text-center text-sm text-[#6b7280]">{error}</p>
            <button
              type="button"
              onClick={() => setTab("sites")}
              className="rounded-2xl bg-[#06c755] px-4 py-2.5 text-[13px] font-extrabold text-white"
            >
              現場一覧へ
            </button>
          </div>
        ) : messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-[#6b7280]">
            まだメッセージはありません。
          </p>
        ) : (
          messages.map((m, i) => {
            const isMine =
              m.sender_role === "worker" &&
              m.sender_worker_id &&
              m.sender_worker_id === mine;
            const isKan = m.sender_role === "kantoku";
            const t = new Date(m.created_at).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            });
            if (isMine) {
              return (
                <div key={i} className="max-w-[80%] self-end">
                  <div className="rounded-[14px_14px_3px_14px] bg-[#06c755] px-3 py-2 text-sm leading-snug whitespace-pre-wrap text-white">
                    {m.body}
                  </div>
                  <div className="mt-0.5 text-right text-[9.5px] text-[#9aa4ad]">{t}</div>
                </div>
              );
            }
            return (
              <div key={i} className="max-w-[82%] self-start">
                <div className="mb-0.5 ml-0.5 text-[10.5px] font-semibold text-[#6b7280]">
                  {m.sender_name ?? (isKan ? "監督" : "職人")}
                  {isKan && <span className="text-[#185fa5]"> 監督</span>}
                </div>
                <div className="rounded-[3px_14px_14px_14px] border border-[#e6eaee] bg-white px-3 py-2 text-sm leading-snug whitespace-pre-wrap">
                  {m.body}
                </div>
                <div className="mt-0.5 ml-0.5 text-[9.5px] text-[#9aa4ad]">{t}</div>
              </div>
            );
          })
        )}
      </div>
      {stickyComposer ? (
        <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[460px] -translate-x-1/2 border-t border-[#e6eaee] bg-white/95 px-4 pt-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm">
          {composer}
        </div>
      ) : (
        <div className="mt-2.5">{composer}</div>
      )}
    </div>
  );
}
