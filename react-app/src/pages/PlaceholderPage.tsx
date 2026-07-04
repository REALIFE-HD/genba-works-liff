export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e6eaee] bg-white px-6 py-12 text-center">
      <p className="text-lg font-extrabold">{title}</p>
      <p className="mt-2 text-sm text-[#6b7280]">
        legacy index.html から順次移植します（REA-189）
      </p>
    </div>
  );
}
