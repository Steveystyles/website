type RegionFilterType = "ALL" | "SCOTLAND" | "ENGLAND"

export default function RegionFilter({
  value,
  onChange,
}: {
  value: RegionFilterType
  onChange: (v: RegionFilterType) => void
}) {
  const btn = (v: RegionFilterType, label: string) => (
    <button
      onClick={() => onChange(v)}
      className={`px-3 py-1 rounded border text-sm
        ${value === v ? "bg-white text-black" : "bg-transparent"}
      `}
    >
      {label}
    </button>
  )

  return (
    <div className="flex gap-2">
      {btn("SCOTLAND", "Scotland")}
      {btn("ENGLAND", "England")}
      {btn("ALL", "All")}
    </div>
  )
}
