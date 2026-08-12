import { Home, HardHat, NotebookPen } from "lucide-react";
import type { TabKey } from "../lib/types";

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "sites", label: "現場", icon: HardHat },
  { key: "report", label: "報告", icon: NotebookPen },
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
  /** 現場チャットの未読。チャットは現場の中にあるため「現場」に出す。 */
  chatAlert?: boolean;
}) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 flex h-[calc(4.5rem+env(safe-area-inset-bottom))] w-full max-w-[460px] -translate-x-1/2 border-t border-[#e6eaee] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      {TABS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`relative flex flex-1 flex-col items-center justify-center gap-1 text-[12px] font-bold ${
            active === key ? "text-[#06c755]" : "text-[#6b7280]"
          }`}
        >
          {key === "sites" && chatAlert && (
            <span className="absolute top-2.5 left-[calc(50%+10px)] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e8453c]" />
          )}
          {key === "report" && reportAlert && (
            <span className="absolute top-2.5 left-[calc(50%+10px)] h-2.5 w-2.5 rounded-full border-2 border-white bg-[#e8453c]" />
          )}
          <Icon className="h-6 w-6" strokeWidth={active === key ? 2.4 : 2.1} />
          {label}
        </button>
      ))}
    </nav>
  );
}
