"use client"

import { useEffect, useMemo, useState } from "react"
import { LiveMatch } from "./types"
import { getPinnedIds, togglePin } from "@/lib/liveScores/pinStorage"

import PinnedMatches from "./PinnedMatches"
import ResultCard from "./ResultCard"
import RegionFilter from "./RegionFilter"

type RegionFilterType = "ALL" | "SCOTLAND" | "ENGLAND"

export default function LiveScoresOutput() {
  const [matches, setMatches] = useState<LiveMatch[]>([])
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  const [filter, setFilter] = useState<RegionFilterType>("ALL")
  const [search, setSearch] = useState("")
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({})

    // 🔁 RESET tick when fresh API data arrives
  useEffect(() => {
    setTick(0)
  }, [matches])

  /* -------------------------
     Load pinned IDs
  -------------------------- */
  useEffect(() => {
    setPinnedIds(getPinnedIds())
  }, [])

  useEffect(() => {
    if (!matches.some(m => m.status === "LIVE")) return

    const interval = setInterval(() => {
      setTick(t => t + 1)
    }, 60000)

    return () => clearInterval(interval)
  }, [matches])
  /* -------------------------
     Fetch live scores (polling)
  -------------------------- */

  useEffect(() => {
    let cancelled = false

    async function refresh() {
      try {
        const res = await fetch("/api/livescores", { cache: "no-store" })
        if (!res.ok) return
        const raw = await res.json()
        const { normaliseSportsDb } = await import(
          "@/lib/liveScores/normaliseSportsDb"
        )

        if (!cancelled) {
          setMatches(normaliseSportsDb(raw))
          setLoading(false)
        }
      } catch {}
    }

    // initial load
    refresh()

    const intervalMs = pinnedIds.length > 0 ? 10000 : 30000
    const interval = setInterval(refresh, intervalMs)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [pinnedIds.length])



  /* -------------------------
     Auto-pin St Mirren
  -------------------------- */
  useEffect(() => {
    const stMirren = matches.find(
      m =>
        m.home.toLowerCase().includes("st mirren") ||
        m.away.toLowerCase().includes("st mirren")
    )

    if (!stMirren) return
    if (pinnedIds.includes(stMirren.matchId)) return

    togglePin(stMirren.matchId)
    setPinnedIds(getPinnedIds())
  }, [matches])

  /* -------------------------
     Helpers
  -------------------------- */
  const onTogglePin = (id: string) => {
    togglePin(id)
    setPinnedIds(getPinnedIds())
  }

  function passesRegion(match: LiveMatch) {
  if (filter === "SCOTLAND") {
    return match.country === "Scotland"
  }

  if (filter === "ENGLAND") {
    return match.country === "England"
  }

  return true // ALL
}


  function passesSearch(match: LiveMatch) {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      match.home.toLowerCase().includes(q) ||
      match.away.toLowerCase().includes(q) ||
      match.league.toLowerCase().includes(q)
    )
  }

  /* -------------------------
     Derived views
  -------------------------- */
  const pinned = matches.filter(m => pinnedIds.includes(m.matchId))

  const unpinned = matches.filter(
    m =>
      !pinnedIds.includes(m.matchId) &&
      passesRegion(m) &&
      passesSearch(m)
  )

  const liveMatches = useMemo(() => {
    const live = unpinned.filter(m => m.status === "LIVE")

    const withTickedMinutes = live.map(m => ({
      ...m,
      minute:
        typeof m.minute === "number"
          ? m.minute + tick
          : m.minute,
    }))

    return withTickedMinutes.sort((a, b) =>
      a.league.localeCompare(b.league)
    )
  }, [unpinned, tick])

  const finishedByLeague = useMemo(() => {
    return unpinned
      .filter(m => m.status === "FT")
      .reduce<Record<string, LiveMatch[]>>((acc, m) => {
        acc[m.league] ??= []
        acc[m.league].push(m)
        return acc
      }, {})
  }, [unpinned])

  /* -------------------------
     Render
  -------------------------- */
  return (
    <div className="flex flex-col h-full gap-3">
      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search teams or leagues…"
        className="w-full rounded-md border bg-transparent px-3 py-2 text-sm"
      />

      {/* Region filter */}
      <RegionFilter value={filter} onChange={setFilter} />

      {/* Pinned */}
      <PinnedMatches matches={pinned} onTogglePin={onTogglePin} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* Live */}
        {liveMatches.length > 0 && (
          <>
            <h3 className="text-sm font-semibold">Live</h3>
            {liveMatches.map(m => (
              <ResultCard
                key={m.matchId}
                match={m}
                pinned={false}
                onTogglePin={onTogglePin}
              />
            ))}
          </>
        )}

        {/* Full Time */}
        {Object.entries(finishedByLeague).map(([league, games]) => {
          const open = expandedLeagues[league] ?? false

          return (
            <div key={league} className="space-y-2">
              {/* League header */}
              <button
                onClick={() =>
                  setExpandedLeagues(prev => ({
                    ...prev,
                    [league]: !open,
                  }))
                }
                className="
                  w-full flex items-center justify-between
                  rounded-lg border px-3 py-2
                  text-sm font-semibold
                  bg-muted/20 hover:bg-muted/40
                  transition
                "
              >
                <span className="truncate">
                  {league}
                  <span className="ml-2 text-xs font-normal opacity-70">
                    ({games.length})
                  </span>
                </span>

                <span className="text-lg leading-none">
                  {open ? "▾" : "▸"}
                </span>
              </button>

              {/* League games */}
              {open && (
                <div className="space-y-2 pl-2">
                  {games.map(m => (
                    <ResultCard
                      key={m.matchId}
                      match={m}
                      pinned={false}
                      onTogglePin={onTogglePin}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}


        {!loading && liveMatches.length === 0 && unpinned.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No matches found.
          </div>
        )}
      </div>
    </div>
  )
}
