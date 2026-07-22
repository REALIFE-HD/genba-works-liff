import { Home, HardHat, NotebookPen, MessageCircle, User } from "lucide-react";

export type TabKey = "home" | "sites" | "report" | "chat" | "me";

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "sites", label: "現場", icon: HardHat },
  { key: "report", label: "日報", icon: NotebookPen },
  { key: "chat", label: "チャット", icon: MessageCircle },
  { key: "me", label: "マイ", icon: User },
];

export function BottomNav({
  active,
  onChange,
  reportAlert,
  chatAlert,
}: {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  reportAlert?: boolean;
  chatAlert?: boolean;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 flex h-[calc(4rem+env(safe-area-inset-bottom))] w-full max-w-[460px] -translate-x-1/2 border-t border-[#e6eaee] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-bold ${
            active === key ? "text-[#06c755]" : "text-[#6b7280]"
          }`}
        >
          {key === "report" && reportAlert && (
            <span className="absolute top-2 left-[calc(50%+8px)] h-2 w-2 rounded-full border-2 border-white bg-[#e8453c]" />
          )}
          {key === "chat" && chatAlert && (
            <span className="absolute top-2 left-[calc(50%+8px)] h-2 w-2 rounded-full border-2 border-white bg-[#e8453c]" />
          )}
          <Icon className="h-5 w-5" strokeWidth={active === key ? 2.4 : 2.1} />
          {label}
        </button>
      ))}
    </nav>
  );
}
