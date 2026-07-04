import { MapPin, QrCode } from "lucide-react";

export function HomePage({
  displayName,
}: {
  displayName: string;
}) {
  return (
    <div className="space-y-4">
      <header className="-mx-4 -mt-4 rounded-b-3xl bg-gradient-to-br from-[#06c755] to-[#04a648] px-4 pb-5 pt-5 text-white shadow-lg shadow-[#06c755]/25">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 text-sm font-extrabold">
            現
          </div>
          <div>
            <p className="text-base font-extrabold leading-tight">現場WORKS</p>
            <p className="text-[9.5px] font-semibold tracking-[0.14em] opacity-85">
              GENBA WORKS
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#05a847]">
              {displayName.slice(0, 1)}
            </span>
            {displayName}
          </div>
        </div>
      </header>

      <section className="rounded-[20px] border border-[#e6eaee] bg-white p-4 shadow-sm">
        <span className="inline-block rounded-full bg-[#eef1f3] px-2.5 py-0.5 text-[11px] font-extrabold text-[#6b7280]">
          未入場
        </span>
        <h2 className="mt-2 text-lg font-extrabold leading-snug">
          現場を選んで QR 打刻
        </h2>
        <p className="mt-1 text-xs text-[#6b7280]">
          React + LIFF 版（Option A）— 旧版は{" "}
          <a
            href="../index.html"
            className="font-semibold text-[#185fa5] underline"
          >
            index.html
          </a>{" "}
          で並行運用
        </p>
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#06c755] py-5 text-lg font-extrabold text-white shadow-md shadow-[#06c755]/30"
        >
          <QrCode className="h-6 w-6" />
          QR を読み取る
        </button>
      </section>

      <section>
        <h3 className="mb-2 px-1 text-xs font-extrabold tracking-wide text-[#6b7280]">
          今日やること
        </h3>
        <div className="rounded-2xl border border-[#e6eaee] bg-[#eef6ff] px-3.5 py-3 text-sm font-bold text-[#185fa5]">
          画面移植中 — ホーム → 現場 → 打刻 → 日報 → チャットの順
        </div>
      </section>

      <section className="rounded-[20px] border border-[#e6eaee] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <MapPin className="h-4 w-4 text-[#06c755]" />
          次の予定
        </div>
        <p className="mt-2 text-sm text-[#6b7280]">現場一覧の移植後に表示</p>
      </section>
    </div>
  );
}
