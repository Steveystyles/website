import { TimelineEvent } from "@/lib/liveScores/parseEventTimeline"

export default function MatchEvents({
  events,
}: {
  events: TimelineEvent[]
}) {
  if (!events.length) {
    return (
      <div className="text-xs opacity-50">
        No match events recorded
      </div>
    )
  }

  return (
    <div className="space-y-2 text-xs">
      {events.map((e, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"
        >
          {/* HOME */}
          <div className="text-right">
            {e.team === "home" && (
              <span>
                {icon(e)} {e.player}
                {e.assist && ` → ${e.assist}`}
              </span>
            )}
          </div>

          {/* TIME */}
          <div className="text-center opacity-60">
            {e.minute}'
          </div>

          {/* AWAY */}
          <div className="text-left">
            {e.team === "away" && (
              <span>
                {icon(e)} {e.player}
                {e.assist && ` → ${e.assist}`}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function icon(e: TimelineEvent) {
  if (e.type === "goal") return "⚽"
  if (e.type === "sub") return "🔁"
  if (e.type === "card") {
    return e.cardType === "red" ? "🟥" : "🟨"
  }
  return ""
}
