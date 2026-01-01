import { LiveMatch } from "./types"
import PinButton from "./PinButton"
import { useEffect, useRef, useState } from "react"
import MatchEvents from "./MatchEvents"
import {
  parseEventTimeline,
  TimelineEvent,
} from "@/lib/liveScores/parseEventTimeline"

export default function ResultCard({
  match,
  pinned,
  onTogglePin,
}: {
  match: LiveMatch
  pinned?: boolean
  onTogglePin: (id: string) => void
}) {
  const isLive = match.status === "LIVE"

  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<TimelineEvent[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Track goal count to auto-open on new goals
  const lastGoalCount = useRef(0)

  async function loadTimeline() {
    if (loading) return
    setLoading(true)
    console.log("EVENT ID:", match.eventId)
    try {
      const res = await fetch(`/api/event-timeline/${match.eventId}`)
      if (!res.ok) return

      const json = await res.json()
      const parsed = parseEventTimeline(json)

      // 🔔 Auto-open if a new goal arrives
      const goalCount = parsed.filter(e => e.type === "goal").length
      if (goalCount > lastGoalCount.current) {
        setOpen(true)
        lastGoalCount.current = goalCount
      }

      setEvents(parsed)
    } finally {
      setLoading(false)
    }
  }

  // Initial load when opening
  useEffect(() => {
    if (open && !events) loadTimeline()
  }, [open])

  // 🔁 Auto-refresh timeline while LIVE
  useEffect(() => {
    if (!open || !isLive) return

    const interval = setInterval(loadTimeline, 30000)
    return () => clearInterval(interval)
  }, [open, isLive])

  const hasEvents = events && events.length > 0

  return (
    <div
      className={`
        rounded-xl border px-3 py-3
        transition-colors
        ${pinned ? "bg-muted/70 border-white/30" : "bg-muted/30"}
      `}
    >
      {/* ================= ROW 1: TEAMS + SCORE ================= */}
      <div className="grid grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)] items-center gap-x-3">
        {/* HOME */}
        <div className="grid grid-cols-[28px_1fr] items-center gap-2 min-w-0">
          {match.homeBadge && (
            <img
              src={match.homeBadge}
              alt={`${match.home} crest`}
              className="h-7 w-7 object-contain"
            />
          )}

          <div className="text-right text-sm font-medium whitespace-normal break-words leading-tight">
            {match.home}
          </div>
        </div>


        {/* SCORE */}
        <div className="text-center">
          <div className="text-lg font-bold tabular-nums">
            {match.homeScore}
            <span className="mx-1 opacity-60">–</span>
            {match.awayScore}
          </div>

          <div className="mt-0.5 text-xs font-semibold">
            {isLive ? (
              <span className="flex justify-center gap-1 text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                LIVE{match.minute ? ` ${match.minute}'` : ""}
              </span>
            ) : (
              <span className="opacity-60">FT</span>
            )}
          </div>
        </div>

        {/* AWAY */}
        <div className="grid grid-cols-[1fr_28px] items-center gap-2 min-w-0">
          <div className="text-left text-sm font-medium whitespace-normal break-words leading-tight">
            {match.away}
          </div>

          {match.awayBadge && (
            <img
              src={match.awayBadge}
              alt={`${match.away} crest`}
              className="h-7 w-7 object-contain"
            />
          )}
        </div>

      </div>

      {/* ================= ROW 2: META ================= */}
      <div className="mt-2 flex justify-between text-xs">
        <span className="text-muted-foreground">{match.league}</span>

        <div className="flex items-center gap-2">
          {match.kickoff && (
            <span className="opacity-70">
              KO {match.kickoff.slice(0, 5)}
            </span>
          )}
          <PinButton
            pinned={pinned}
            onClick={() => onTogglePin(match.matchId)}
          />
        </div>
      </div>

      {/* ================= ROW 3: DETAILS ================= */}
      <div className="mt-2">
        <button
          onClick={() => setOpen(o => !o)}
          className="text-xs font-medium opacity-70 hover:opacity-100"
        >
          {open ? "Hide match details ▴" : "Show match details ▾"}
        </button>

        {open && (
          <div className="mt-2 rounded-md border bg-muted/20 p-2">
            {loading && (
              <div className="text-xs opacity-60">Loading events…</div>
            )}

            {events && hasEvents && (
              <MatchEvents events={events} />
            )}

            {events && !hasEvents && (
              <div className="text-xs opacity-50">
                {isLive
                  ? "Live match events will appear here"
                  : "No match events recorded"}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
