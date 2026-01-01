"use client"

type TeamRowCardProps = {
  position: number
  team: string
  badge?: string
  goalDiff: number
  points: number
  form?: ("W" | "D" | "L")[]
  active?: boolean
  onClick?: () => void
}

function FormStrip({ form }: { form?: ("W" | "D" | "L")[] }) {
  if (!form) return null

  return (
    <div className="flex gap-1 mt-1">
      {form.map((r, i) => (
        <div
          key={i}
          className={`
            h-4 w-4
            flex items-center justify-center
            rounded
            text-[9px] font-bold
            leading-none
            ${
              r === "W"
                ? "bg-green-600 text-white"
                : r === "D"
                ? "bg-yellow-500 text-black"
                : "bg-red-600 text-white"
            }
          `}
        >
          {r}
        </div>
      ))}
    </div>
  )
}

export default function TeamRowCard({
  position,
  team,
  badge,
  goalDiff,
  points,
  form,
  active,
  onClick,
}: TeamRowCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full
        px-4 py-3
        transition-all
        ${
          active
            ? "bg-smfc-red/25 ring-1 ring-smfc-red/40 scale-[1.02]"
            : "hover:bg-neutral-800"
        }
      `}
    >
      <div className="flex items-center">
        {/* ---------------- LEFT ZONE ---------------- */}
        <div className="flex items-center gap-3 w-[72px] shrink-0">
          <div className="w-5 text-sm text-neutral-400">
            {position}
          </div>

          {badge && (
            <img
              src={badge}
              alt=""
              className="h-8 w-8 object-contain"
            />
          )}
        </div>

        {/* ---------------- MIDDLE ZONE ---------------- */}
        <div className="flex-1 min-w-0 text-left">
          <div className="font-medium truncate">
            {team}
          </div>
          <FormStrip form={form} />
        </div>

        {/* ---------------- RIGHT ZONE ---------------- */}
        <div className="flex flex-col items-end w-[56px] shrink-0">
          <div className="text-xs text-neutral-400 tabular-nums">
            {goalDiff > 0 ? `+${goalDiff}` : goalDiff}
          </div>
          <div className="font-semibold tabular-nums">
            {points}
          </div>
        </div>
      </div>
    </button>
  )
}
