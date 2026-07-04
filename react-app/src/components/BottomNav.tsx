import { Home, HardHat, NotebookPen, MessageCircle, User } from "lucide-react";

export type TabKey = "home" | "sites" | "report" | "chat" | "me";

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "sites", label: "現場", icon: HardHat },
  { key: "report", label: "日報", icon: NotebookPen },
  { key: "chat", label: "チャット", icon: MessageCircle },
  { key: "me", label: "マイページ", icon: User },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 flex h-[calc(4rem+env(safe-area-inset-bottom))] w-full max-w-[460px] -translate-x-1/2 border-t border-[#e6eaee] bg-white pb-[env(safe-area-inset-bottom)]">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
            active === key ? "text-[#06c755]" : "text-[#6b7280]"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
          {label}
        </button>
      ))}
    </nav>
  );
}
