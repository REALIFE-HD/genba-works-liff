import { useEffect, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { Header } from "./components/Header";
import { RegisterOverlay } from "./components/RegisterOverlay";
import { GenbaProvider, useGenba } from "./context/GenbaContext";
import { ensureLiffSession, LiffLoginRedirectError } from "./liff/init";
import { ChatPage } from "./pages/ChatPage";
import { HomePage } from "./pages/HomePage";
import { MyPage } from "./pages/MyPage";
import { PunchPage } from "./pages/PunchPage";
import { ReportPage } from "./pages/ReportPage";
import { SiteDetailPage } from "./pages/SiteDetailPage";
import { SitesPage } from "./pages/SitesPage";

type Phase =
  | { kind: "loading" }
  | { kind: "redirect" }
  | { kind: "error"; message: string }
  | { kind: "ready"; displayName: string };

function AppShell() {
  const { view, tab, setTab, me, reportAlert, displayName } = useGenba();

  return (
    <>
      <Header displayName={displayName} env={me?.env} />
      <main className="px-4 pt-4">
        {view === "home" && <HomePage />}
        {view === "punch" && <PunchPage />}
        {view === "sites" && <SitesPage />}
        {view === "site" && <SiteDetailPage />}
        {view === "report" && <ReportPage />}
        {view === "chat" && <ChatPage />}
        {view === "my" && <MyPage />}
      </main>
      {view !== "punch" && (
        <BottomNav active={tab} onChange={setTab} reportAlert={reportAlert} />
      )}
      <RegisterOverlay />
    </>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const l = await ensureLiffSession();
        const profile = await l.getProfile();
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
    <GenbaProvider displayName={phase.displayName}>
      <div className="mx-auto min-h-dvh max-w-[460px] pb-[calc(5rem+env(safe-area-inset-bottom))]">
        <AppShell />
      </div>
    </GenbaProvider>
  );
}
