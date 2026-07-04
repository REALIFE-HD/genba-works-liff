import { useEffect, useState } from "react";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { HomePage } from "./pages/HomePage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { ensureLiffSession, LiffLoginRedirectError, liff } from "./liff/init";

type Phase =
  | { kind: "loading" }
  | { kind: "redirect" }
  | { kind: "error"; message: string }
  | { kind: "ready"; displayName: string };

export default function App() {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [tab, setTab] = useState<TabKey>("home");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensureLiffSession();
        const profile = await liff.getProfile();
        if (!cancelled) {
          setPhase({
            kind: "ready",
            displayName: profile.displayName || "職人",
          });
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof LiffLoginRedirectError) {
          setPhase({ kind: "redirect" });
          return;
        }
        setPhase({
          kind: "error",
          message: e instanceof Error ? e.message : String(e),
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (phase.kind === "loading" || phase.kind === "redirect") {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-[#6b7280]">
        {phase.kind === "redirect" ? "LINE ログインへ…" : "LIFF 初期化中…"}
      </div>
    );
  }

  if (phase.kind === "error") {
    return (
      <div className="mx-auto max-w-[460px] p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {phase.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-[460px] pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <main className="px-4 pt-4">
        {tab === "home" ? (
          <HomePage displayName={phase.displayName} />
        ) : tab === "sites" ? (
          <PlaceholderPage title="現場一覧" />
        ) : tab === "report" ? (
          <PlaceholderPage title="日報" />
        ) : tab === "chat" ? (
          <PlaceholderPage title="現場チャット" />
        ) : (
          <PlaceholderPage title="マイページ" />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}
