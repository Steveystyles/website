"use client"

import { useEffect, useState, useRef } from "react"
import { SoccerIndex } from "@/lib/data/soccerIndex"
import { buildSuggestions } from "@/lib/search/buildSuggestions"
import { SearchSuggestion } from "@/lib/search/types"
import TeamRowCard from "./TeamRowCard"

type LeagueRow = {
  idTeam: string
  team: string
  points: number
  position: number
  goalDiff: number
  badge?: string
  form?: ("W" | "D" | "L")[]
}

const ROW_HEIGHT = 64
const VISIBLE_ROWS = 7
const DEFAULT_LEAGUE_ID = "4330"

/* ---------- helpers ---------- */

function getFormFromEvents(events: any[], teamId: string) {
  return events.slice(0, 5).map(e => {
    const isHome = e.idHomeTeam === teamId
    const h = Number(e.intHomeScore)
    const a = Number(e.intAwayScore)
    if (h === a) return "D"
    return (isHome && h > a) || (!isHome && a > h) ? "W" : "L"
  })
}

/* ---------- component ---------- */

export default function FootballExplorer({ index }: { index: SoccerIndex }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [rows, setRows] = useState<LeagueRow[]>([])
  const [highlightTeam, setHighlightTeam] = useState<string | null>(null)
  const [teamInfo, setTeamInfo] = useState<any>(null)
  const [lastMatch, setLastMatch] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchingRef = useRef(false)
  const listRef = useRef<HTMLDivElement | null>(null)
  const lastMatchCache = useRef<Record<string, any>>({})

  /* ---------- initial load ---------- */
  useEffect(() => {
    const league = index.find(l => l.idLeague === DEFAULT_LEAGUE_ID)
    const team = league?.teams.find(t =>
      t.name.toLowerCase().includes("st mirren")
    )

    if (team) {
      setQuery(`${team.name} (${league?.name})`)
      loadLeague(DEFAULT_LEAGUE_ID, team.idTeam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- auto-centre active row ---------- */
  useEffect(() => {
    if (!highlightTeam || !listRef.current) return
    const el = listRef.current.querySelector(
      `[data-team-id="${highlightTeam}"]`
    ) as HTMLElement | null

    el?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [highlightTeam])

  function onChange(value: string) {
    setQuery(value)
    setSuggestions(buildSuggestions(value, index))
  }

  /* ---------- load league ---------- */
  async function loadLeague(idLeague: string, teamId?: string) {
    if (fetchingRef.current) return
    fetchingRef.current = true
    setLoading(true)

    try {
      setRows([])
      setTeamInfo(null)
      setLastMatch(null)

      const tableRes = await fetch(
        `/api/league-table?league=${idLeague}`
      ).then(r => r.json())

      const league = index.find(l => l.idLeague === idLeague)

      const baseRows: LeagueRow[] = tableRes.table.map((r: any) => {
        const t = league?.teams.find(x => x.idTeam === String(r.idTeam))
        return {
          idTeam: String(r.idTeam),
          team: r.strTeam,
          points: Number(r.intPoints),
          position: Number(r.intRank),
          goalDiff: Number(r.intGoalDifference),
          badge: t?.badge,
        }
      })

      setRows(baseRows)

      // fetch form in background
      Promise.all(
        baseRows.map(async row => {
          try {
            const res = await fetch(
              `/api/last-match?team=${row.idTeam}`
            ).then(r => r.json())

            return {
              idTeam: row.idTeam,
              form: res.results
                ? getFormFromEvents(res.results, row.idTeam)
                : undefined,
            }
          } catch {
            return null
          }
        })
      ).then(results => {
        setRows(prev =>
          prev.map(r => {
            const f = results.find(x => x?.idTeam === r.idTeam)
            return f ? { ...r, form: f.form } : r
          })
        )
      })

      selectTeam(teamId ?? baseRows[0]?.idTeam)
    } finally {
      fetchingRef.current = false
      setLoading(false)
    }
  }

  /* ---------- select team ---------- */
  async function selectTeam(idTeam?: string) {
    if (!idTeam || loading) return
    setHighlightTeam(idTeam)

    const teamRes = await fetch(`/api/team?team=${idTeam}`).then(r => r.json())
    setTeamInfo(teamRes.lookup?.[0] ?? null)

    if (lastMatchCache.current[idTeam]) {
      setLastMatch(lastMatchCache.current[idTeam])
    } else {
      const lastRes = await fetch(
        `/api/last-match?team=${idTeam}`
      ).then(r => r.json())
      const match = lastRes.results?.[0] ?? null
      lastMatchCache.current[idTeam] = match
      setLastMatch(match)
    }
  }

  async function onSelect(s: SearchSuggestion) {
    setSuggestions([])
    setQuery(s.label)
    await loadLeague(s.idLeague, s.type === "team" ? s.idTeam : undefined)
  }

  /* ---------- render ---------- */
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="mx-auto w-full max-w-md px-3 space-y-3">

        {/* Search */}
        <div className="relative">
          <div className="rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-3">
            <input
              value={query}
              onFocus={() => {
                setQuery("")
              }}
              onChange={e => {
                const value = e.target.value
                setQuery(value)
                setSuggestions(buildSuggestions(value, index))
              }}
              placeholder="Search team or league…"
              className="
                w-full
                bg-transparent
                outline-none
                text-base
                placeholder-neutral-500
              "
            />
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 shadow-lg">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => onSelect(s)}
                  className="px-4 py-2 text-sm hover:bg-neutral-800 cursor-pointer"
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team card */}
        {teamInfo && (
          <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-4">
            <div className="flex items-center gap-3 mb-1">
              {teamInfo.strBadge && (
                <img src={teamInfo.strBadge} className="h-10 w-10" />
              )}
              <div className="font-semibold">{teamInfo.strTeam}</div>
            </div>

            {lastMatch && (
              <div className="text-xs text-neutral-400">
                Last: {lastMatch.strHomeTeam} {lastMatch.intHomeScore}
                {" – "}
                {lastMatch.intAwayScore} {lastMatch.strAwayTeam}
              </div>
            )}

            <div className="text-xs text-neutral-500 mt-1">
              Next match coming soon
            </div>
          </div>
        )}

        {/* League list */}
        {rows.length > 0 && (
          <div className="pb-24">
            <div
              className="relative rounded-2xl border border-neutral-700 bg-neutral-900 overflow-hidden"
              style={{ height: `${ROW_HEIGHT * VISIBLE_ROWS}px` }}
            >
              {/* fades */}
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-neutral-900 to-transparent z-10" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-neutral-900 to-transparent z-10" />

              <div
                ref={listRef}
                className={`h-full overflow-y-auto snap-y snap-mandatory scroll-smooth ${
                  loading ? "pointer-events-none opacity-60" : ""
                }`}
              >
                {rows.map(r => (
                  <TeamRowCard
                    key={r.idTeam}
                    position={r.position}
                    team={r.team}
                    badge={r.badge}
                    goalDiff={r.goalDiff}
                    points={r.points}
                    form={r.form}
                    active={r.idTeam === highlightTeam}
                    onClick={() => selectTeam(r.idTeam)}
                    data-team-id={r.idTeam}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
