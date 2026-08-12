import { BackBtn } from "../components/ui/Card";
import { DmPanel } from "../components/DmPanel";
import { useGenba } from "../context/GenbaContext";

/**
 * 個人メッセージ専用ページ。現場の連絡は現場詳細の「連絡」タブに集約したため、
 * ここでは職人どうしの1対1のやり取りだけを扱う。
 */
export function ChatPage() {
  const { go } = useGenba();

  return (
    <div>
      <BackBtn onClick={() => go("my")} label="マイへ" />
      <div className="mb-3 px-1">
        <h2 className="text-[19px] font-extrabold text-[#14181b]">個人メッセージ</h2>
        <p className="mt-0.5 text-[13.5px] font-semibold text-[#6b7280]">
          現場の連絡は「現場」→ 連絡タブから
        </p>
      </div>
      <DmPanel />
    </div>
  );
}
