export function fmtTime(iso: string | null | undefined): string {
  if (!iso) return "–";
  return new Date(iso).toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function jstToday(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

export function weekday(ymd: string): string {
  return "日月火水木金土"[new Date(`${ymd}T00:00:00+09:00`).getDay()];
}

export function fmtMD(ymd: string): string {
  return `${parseInt(ymd.slice(5, 7), 10)}/${parseInt(ymd.slice(8, 10), 10)}(${weekday(ymd)})`;
}

export function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function navUrl(address: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
}

export function gcalUrl(siteName: string, start: string, end: string): string {
  const d = new Date(`${end}T00:00:00+09:00`);
  d.setDate(d.getDate() + 1);
  const e2 = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" }).replace(/-/g, "");
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
    encodeURIComponent(`現場WORKS ${siteName}`) +
    `&dates=${start.replace(/-/g, "")}/${e2}&details=` +
    encodeURIComponent("現場WORKSで登録した予定")
  );
}

export function newIdempotencyKey(): string {
  return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
