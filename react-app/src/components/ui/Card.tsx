export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-4 rounded-[20px] border border-[#e6eaee] bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Section({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2.5 flex items-center gap-1.5 px-1 text-xs font-extrabold tracking-wide text-[#6b7280]">
      {children}
    </h3>
  );
}

export function StatusBar({
  message,
  kind = "",
}: {
  message: string;
  kind?: "" | "ok" | "err" | "busy";
}) {
  const dot =
    kind === "ok"
      ? "bg-[#0a8f4f]"
      : kind === "err"
        ? "bg-[#e8453c]"
        : kind === "busy"
          ? "animate-pulse bg-amber-500"
          : "bg-[#6b7280]";
  const msg =
    kind === "err"
      ? "text-[#cf3a31]"
      : kind === "ok"
        ? "text-[#0a8f4f]"
        : "text-[#14181b]";
  return (
    <div className="flex items-start gap-2.5 rounded-2xl border border-[#e6eaee] bg-white px-4 py-3.5 text-[13.5px] leading-relaxed shadow-sm">
      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
      <span className={`whitespace-pre-wrap break-all font-semibold ${msg}`}>
        {message}
      </span>
    </div>
  );
}

export function BackBtn({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-1 inline-flex items-center gap-1 bg-transparent px-1 py-1.5 text-[13.5px] font-bold text-[#6b7280]"
    >
      ‹ {label}
    </button>
  );
}

export function PrimaryBtn({
  children,
  onClick,
  disabled,
  className = "",
  danger,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-2xl py-5 text-lg font-extrabold text-white disabled:bg-[#e9edf0] disabled:text-[#aab2b9] disabled:shadow-none ${
        danger
          ? "bg-[#e8453c] shadow-md shadow-[#e8453c]/30"
          : "bg-[#06c755] shadow-md shadow-[#06c755]/30"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[14px] border border-[#e6eaee] bg-white py-3.5 text-sm font-extrabold text-[#14181b]"
    >
      {children}
    </button>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon?: React.ReactNode;
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#e6eaee] bg-white px-5 py-10 text-center shadow-sm">
      {icon && (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e7f8ef] text-[#06c755]">
          {icon}
        </div>
      )}
      <p className="text-[15px] font-extrabold text-[#14181b]">{title}</p>
      {body && (
        <p className="mx-auto mt-1.5 max-w-[260px] text-[12.5px] leading-relaxed font-semibold text-[#6b7280]">
          {body}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#06c755] px-4 py-2.5 text-[13px] font-extrabold text-white"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
