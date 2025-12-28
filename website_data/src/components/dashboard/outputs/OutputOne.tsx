"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import OutputOneSkeleton from "./OutputOneSkeleton"

type League = {
  idLeague: string
  strLeague: string
  strSport?: string
  strCountry?: string
  strBadge?: string
}

type Team = {
  idTeam: string
  strTeam: string
  strTeamBadge?: string
  strLeague?: string
  idLeague?: string
  strCountry?: string
  strStadium?: string
  intFormedYear?: string
}

type SearchItem =
  | { kind: "league"; id: string; title: string; subtitle?: string; badge?: string }
  | { kind: "team"; id: string; title: string; subtitle?: string; badge?: string }

type LeagueRow = {
  position: number
  teamId: string
  teamName: string
  won: number
  lost: number
  goalDifference: number
  points: number
  crest: string
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export default function FootballExplorer() {
  const [bootLoading, setBootLoading] = useState(true)

  const [query, setQuery] = useState("")
  const [remoteLeagues, setRemoteLeagues] = useState<League[]>([])
  const [remoteTeams, setRemoteTeams] = useState<Team[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  const [tableRows, setTableRows] = useState<LeagueRow[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [tableError, setTableError] = useState<string | null>(null)

  // Avoid race conditions for rapid typing
  const lastSearchId = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setBootLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  // Debounced search
  useEffect(() => {
    const q = query.trim()
    setSearchError(null)

    if (q.length < 2) {
      setRemoteLeagues([])
      setRemoteTeams([])
      setSearchLoading(false)
      return
    }

    setSearchLoading(true)
    const myId = ++lastSearchId.current

    const timer = setTimeout(async () => {
      try {
        const json = await getJson<{ leagues: League[]; teams: Team[] }>(
          `/api/football/search?q=${encodeURIComponent(q)}`
        )
        // Only apply latest result
        if (myId !== lastSearchId.current) return
        setRemoteLeagues(json.leagues ?? [])
        setRemoteTeams(json.teams ?? [])
      } catch (e: any) {
        if (myId !== lastSearchId.current) return
        setSearchError(e?.message ?? "Search failed")
        setRemoteLeagues([])
        setRemoteTeams([])
      } finally {
        if (myId === lastSearchId.current) setSearchLoading(false)
      }
    }, 250)

    return () => clearTimeout(timer)
  }, [query])

  const suggestions = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase()

    const leagues: SearchItem[] = (remoteLeagues ?? [])
      .filter((l) => (l?.strLeague ?? "").toLowerCase().includes(q))
      .slice(0, 6)
      .map((l) => ({
        kind: "league",
        id: String(l.idLeague),
        title: l.strLeague,
        subtitle: [l.strCountry, l.strSport].filter(Boolean).join(" • ") || undefined,
        badge: l.strBadge,
      }))

    const teams: SearchItem[] = (remoteTeams ?? [])
      .filter((t) => (t?.strTeam ?? "").toLowerCase().includes(q))
      .slice(0, 6)
      .map((t) => ({
        kind: "team",
        id: String(t.idTeam),
        title: t.strTeam,
        subtitle: [t.strLeague, t.strCountry].filter(Boolean).join(" • ") || undefined,
        badge: t.strTeamBadge,
      }))

    // Simple interleave: leagues first (feel free to flip)
    return [...leagues, ...teams]
  }, [query, remoteLeagues, remoteTeams])

  async function selectLeague(idLeague: string) {
    setSelectedTeam(null)
    setTableRows([])
    setTableError(null)
    setTableLoading(true)

    try {
      const [{ league }, table] = await Promise.all([
        getJson<{ league: League | null }>(
          `/api/football/league?id=${encodeURIComponent(idLeague)}`
        ),
        getJson<{ rows: LeagueRow[]; leagueName: string }>(
          `/api/football/table?leagueId=${encodeURIComponent(idLeague)}`
        ),
      ])

      setSelectedLeague(league)
      setTableRows(table.rows ?? [])

      // If we have a table, auto-select the top team
      const top = (table.rows ?? [])[0]
      if (top?.teamId) {
        const t = await getJson<{ team: Team | null }>(
          `/api/football/team?id=${encodeURIComponent(top.teamId)}`
        )
        setSelectedTeam(t.team)
      }
    } catch (e: any) {
      setTableError(e?.message ?? "Failed to load league")
    } finally {
      setTableLoading(false)
    }
  }

  async function selectTeam(idTeam: string) {
    setTableRows([])
    setTableError(null)
    setTableLoading(false)
    setSelectedLeague(null)

    try {
      const { team } = await getJson<{ team: Team | null }>(
        `/api/football/team?id=${encodeURIComponent(idTeam)}`
      )
      setSelectedTeam(team)
    } catch (e: any) {
      setSearchError(e?.message ?? "Failed to load team")
    }
  }

  async function clickTableTeam(teamId: string) {
    try {
      const { team } = await getJson<{ team: Team | null }>(
        `/api/football/team?id=${encodeURIComponent(teamId)}`
      )
      setSelectedTeam(team)
    } catch {
      // ignore
    }
  }

  if (bootLoading) return <OutputOneSkeleton />

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-smfc-white">Football Explorer</h2>
          <p className="text-xs text-neutral-400">
            Search leagues or teams • tap a league to see the table
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-smfc-grey bg-smfc-black px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-smfc-red" />
          <span className="text-[11px] text-neutral-300">St Mirren theme</span>
        </div>
      </header>

      {/* Search */}
      <div className="rounded-xl border border-smfc-grey bg-smfc-black p-3">
        <label className="block text-xs font-medium text-neutral-300">
          Search
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Scottish Premiership, St Mirren"
            className="w-full rounded-lg border border-smfc-grey bg-smfc-charcoal px-3 py-2 text-sm text-smfc-white placeholder:text-neutral-500 outline-none focus:border-smfc-red"
            autoComplete="off"
          />
          {searchLoading ? (
            <div className="h-9 w-9 rounded-lg border border-smfc-grey bg-smfc-charcoal animate-pulse" />
          ) : (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setRemoteLeagues([])
                setRemoteTeams([])
                setSearchError(null)
              }}
              className="h-9 px-3 rounded-lg border border-smfc-grey bg-smfc-charcoal text-xs text-neutral-300 hover:border-smfc-red"
            >
              Clear
            </button>
          )}
        </div>

        {(searchError || tableError) && (
          <p className="mt-2 text-xs text-smfc-red">{searchError || tableError}</p>
        )}

        {/* Suggestion list */}
        {suggestions.length > 0 && (
          <div className="mt-3 overflow-hidden rounded-lg border border-smfc-grey">
            {suggestions.map((s) => (
              <button
                key={`${s.kind}:${s.id}`}
                type="button"
                onClick={() =>
                  s.kind === "league" ? selectLeague(s.id) : selectTeam(s.id)
                }
                className="flex w-full items-center gap-3 bg-smfc-black px-3 py-2 text-left hover:bg-smfc-charcoal"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-md border border-smfc-grey bg-smfc-charcoal">
                  {s.badge ? (
                    <Image
                      src={s.badge}
                      alt=""
                      fill
                      className="object-contain"
                      sizes="32px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-smfc-white">
                    {s.title}
                  </div>
                  {s.subtitle ? (
                    <div className="truncate text-xs text-neutral-400">{s.subtitle}</div>
                  ) : null}
                </div>
                <span className="rounded-full border border-smfc-grey px-2 py-0.5 text-[10px] text-neutral-300">
                  {s.kind}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected info */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-smfc-grey bg-smfc-black p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-smfc-white">League</h3>
            {selectedLeague?.strLeague ? (
              <span className="text-[11px] text-neutral-400">selected</span>
            ) : null}
          </div>
          {selectedLeague ? (
            <div className="mt-2">
              <div className="text-sm text-smfc-white font-medium">
                {selectedLeague.strLeague}
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                {[selectedLeague.strCountry, selectedLeague.strSport]
                  .filter(Boolean)
                  .join(" • ")}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-neutral-400">No league selected.</p>
          )}
        </div>

        <div className="rounded-xl border border-smfc-grey bg-smfc-black p-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-smfc-white">Team</h3>
            {selectedTeam?.strTeam ? (
              <span className="text-[11px] text-neutral-400">selected</span>
            ) : null}
          </div>

          {selectedTeam ? (
            <div className="mt-2 flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-smfc-grey bg-smfc-charcoal">
                {selectedTeam.strTeamBadge ? (
                  <Image
                    src={selectedTeam.strTeamBadge}
                    alt=""
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-smfc-white">
                  {selectedTeam.strTeam}
                </div>
                <div className="truncate text-xs text-neutral-400">
                  {[selectedTeam.strLeague, selectedTeam.strCountry]
                    .filter(Boolean)
                    .join(" • ")}
                </div>
                {selectedTeam.strStadium ? (
                  <div className="truncate text-xs text-neutral-500">
                    {selectedTeam.strStadium}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-neutral-400">No team selected.</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-smfc-grey bg-smfc-black p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-smfc-white">League Table</h3>
          {tableLoading ? (
            <span className="text-[11px] text-neutral-400">loading…</span>
          ) : selectedLeague ? (
            <span className="text-[11px] text-neutral-400">tap a team</span>
          ) : (
            <span className="text-[11px] text-neutral-500">select a league</span>
          )}
        </div>

        {!selectedLeague ? (
          <p className="mt-2 text-xs text-neutral-400">
            Pick a league from the search results to load the current table.
          </p>
        ) : tableRows.length === 0 && !tableLoading ? (
          <p className="mt-2 text-xs text-neutral-400">
            No table returned for this league.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-neutral-400">
                <tr className="border-b border-smfc-grey">
                  <th className="py-2 pr-2 w-10">#</th>
                  <th className="py-2 pr-2">Team</th>
                  <th className="py-2 pr-2 w-10">W</th>
                  <th className="py-2 pr-2 w-10">L</th>
                  <th className="py-2 pr-2 w-12">GD</th>
                  <th className="py-2 pr-0 w-12 text-smfc-white">Pts</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r) => (
                  <tr
                    key={r.teamId}
                    className="border-b border-smfc-grey/60 hover:bg-smfc-charcoal cursor-pointer"
                    onClick={() => clickTableTeam(r.teamId)}
                  >
                    <td className="py-2 pr-2 text-neutral-300">{r.position}</td>
                    <td className="py-2 pr-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative h-5 w-5 overflow-hidden rounded border border-smfc-grey bg-smfc-charcoal">
                          {r.crest ? (
                            <Image
                              src={r.crest}
                              alt=""
                              fill
                              className="object-contain"
                              sizes="20px"
                            />
                          ) : null}
                        </div>
                        <span
                          className={`truncate ${
                            selectedTeam?.idTeam === r.teamId
                              ? "text-smfc-white font-semibold"
                              : "text-neutral-200"
                          }`}
                        >
                          {r.teamName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 pr-2 text-neutral-300">{r.won}</td>
                    <td className="py-2 pr-2 text-neutral-300">{r.lost}</td>
                    <td className="py-2 pr-2 text-neutral-300">{r.goalDifference}</td>
                    <td className="py-2 pr-0 text-smfc-white font-semibold">{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
