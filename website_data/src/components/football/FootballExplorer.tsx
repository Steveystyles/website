"use client"

import { useEffect, useState, useRef } from "react"
import { SoccerIndex } from "@/lib/data/soccerIndex"
import { buildSuggestions } from "@/lib/search/buildSuggestions"
import { SearchSuggestion } from "@/lib/search/types"

type LeagueRow = {
  idTeam: string
  team: string
  points: number
  position: number
  badge?: string
  form?: ("W" | "D" | "L")[]
}

const DEFAULT_LEAGUE_ID = "4330" // Scottish Premiership
const DEFAULT_TEAM_NAME = "St Mirren"

function getFormFromEvents(events: any[], teamId: string) {
  return events.slice(0, 5).map((e) => {
    const isHome = e.idHomeTeam === teamId
    const home = Number(e.intHomeScore)
    const away = Number(e.intAwayScore)

    if (home === away) return "D"
    return (isHome && home > away) || (!isHome && away > home) ? "W" : "L"
  })
}

function FormDots({ form }: { form?: ("W" | "D" | "L")[] }) {
  if (!form) return null

  return (
    <div className="flex gap-1 mt-1">
      {form.map((r, i) => (
        <span
          key={i}
          className={`h-2.5 w-2.5 rounded-full ${
            r === "W"
              ? "bg-green-500"
              : r === "D"
              ? "bg-yellow-500"
              : "bg-red-500"
          }`}
        />
      ))}
    </div>
  )
}

export default function FootballExplorer({ index }: { index: SoccerIndex }) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [rows, setRows] = useState<LeagueRow[]>([])
  const [leagueId, setLeagueId] = useState<string | null>(null)
  const [highlightTeam, setHighlightTeam] = useState<string | null>(null)
  const [teamInfo, setTeamInfo] = useState<any>(null)
  const [lastMatch, setLastMatch] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchingRef = useRef(false)

  /* -----------------------------
   * Initial load (St Mirren)
   * --------------------------- */
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

  function onChange(value: string) {
    setQuery(value)
    setSuggestions(buildSuggestions(value, index))
  }

  /* -----------------------------
   * Load league (ONCE)
   * --------------------------- */
  async function loadLeague(idLeague: string, teamId?: string) {
    if (fetchingRef.current) return
    fetchingRef.current = true

    try {
      setLoading(true)
      setLeagueId(idLeague)
      setRows([])
      setTeamInfo(null)
      setLastMatch(null)

      const tableRes = await fetch(
        `/api/league-table?league=${idLeague}`
      ).then(r => r.json())

      const league = index.find(l => l.idLeague === idLeague)

      const baseRows: LeagueRow[] = tableRes.table.map((r: any) => {
        const teamFromIndex = league?.teams.find(
          t => t.idTeam === String(r.idTeam)
        )

        return {
          idTeam: String(r.idTeam),
          team: r.strTeam,
          points: Number(r.intPoints),
          position: Number(r.intRank),
          badge: teamFromIndex?.badge,
        }
      })

      setRows(baseRows)

      // Fetch form in background
      Promise.all(
        baseRows.map(async (row) => {
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
            const found = results.find(x => x?.idTeam === r.idTeam)
            return found ? { ...r, form: found.form } : r
          })
        )
      })

      if (teamId) {
        selectTeam(teamId)
      } else {
        selectTeam(baseRows[0]?.idTeam)
      }
    } finally {
      fetchingRef.current = false
      setLoading(false)
    }
  }

  /* -----------------------------
   * Select team ONLY
   * --------------------------- */
  async function selectTeam(idTeam?: string) {
    if (!idTeam) return

    setHighlightTeam(idTeam)

    const teamRes = await fetch(
      `/api/team?team=${idTeam}`
    ).then(r => r.json())

    setTeamInfo(teamRes.lookup?.[0] ?? null)

    const lastRes = await fetch(
      `/api/last-match?team=${idTeam}`
    ).then(r => r.json())

    setLastMatch(lastRes.results?.[0] ?? null)
  }

  async function onSelect(s: SearchSuggestion) {
    setSuggestions([])
    setQuery(s.label)

    if (s.type === "team") {
      await loadLeague(s.idLeague, s.idTeam)
    } else {
      await loadLeague(s.idLeague)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Search */}
      <div className="sticky top-0 z-20 bg-smfc-charcoal pb-3">
        <input
          value={query}
          onFocus={() => {
            setQuery("")
            setSuggestions([])
          }}
          onChange={e => onChange(e.target.value)}
          placeholder="Search team or league…"
          className="w-full rounded-xl bg-neutral-900 border border-smfc-grey px-4 py-3 text-base"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <ul className="rounded-lg border border-smfc-grey bg-neutral-900 divide-y divide-smfc-grey">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => onSelect(s)}
              className="px-3 py-2 cursor-pointer hover:bg-neutral-800"
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}

      {/* Team panel */}
      {teamInfo && (
        <div className="
          sticky top-0 z-10
          mb-3
          rounded-2xl
          border border-smfc-grey
          bg-neutral-900/95
          p-4
          backdrop-blur
          shadow-lg
        ">
          <div className="flex items-center gap-3 mb-2">
            {teamInfo.strBadge && (
              <img src={teamInfo.strBadge} className="h-10 w-10" />
            )}
            <h3 className="font-semibold">{teamInfo.strTeam}</h3>
          </div>

          {lastMatch && (
            <div className="text-sm text-neutral-300">
              {lastMatch.strHomeTeam} {lastMatch.intHomeScore}
              {" – "}
              {lastMatch.intAwayScore} {lastMatch.strAwayTeam}
            </div>
          )}
        </div>
      )}

      {/* League list */}
      {rows.length > 0 && (
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="divide-y divide-neutral-800 rounded-lg border border-smfc-grey bg-neutral-900">
            {rows.map(r => (
              <button
                key={r.idTeam}
                onClick={() => selectTeam(r.idTeam)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left ${
                  r.idTeam === highlightTeam
                    ? "bg-smfc-red/30 text-smfc-white"
                    : "hover:bg-neutral-800"
                }`}
              >
                <div className="w-6 text-sm text-neutral-400">
                  {r.position}
                </div>

                {r.badge && (
                  <img src={r.badge} className="h-8 w-8" />
                )}

                <div className="flex-1">
                  <div className="font-medium">{r.team}</div>
                  <FormDots form={r.form} />
                </div>

                <div className="text-sm font-semibold">
                  {r.points}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
