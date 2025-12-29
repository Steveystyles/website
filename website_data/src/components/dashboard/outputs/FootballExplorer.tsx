"use client"

import { useEffect, useState } from "react"

type SearchResult = {
  type: "league" | "team"
  id: string
  name: string
}

type LeagueTableRow = {
  position: number
  teamId: string
  teamName: string
  points: number
  goalDifference: number
  crest: string
}

type TeamInfo = {
  idTeam: string
  strTeam: string
  strLeague: string
  strTeamBadge?: string
  strStadium?: string
  strDescriptionEN?: string
}

export default function OutputOne() {
  const [search, setSearch] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  const [leagueId, setLeagueId] = useState<string | null>(null)
  const [leagueName, setLeagueName] = useState("")
  const [table, setTable] = useState<LeagueTableRow[]>([])

  const [team, setTeam] = useState<TeamInfo | null>(null)
  const [loadingTable, setLoadingTable] = useState(false)
  const [loadingTeam, setLoadingTeam] = useState(false)

  /* ---------------------------------------------------------
     SEARCH (v2)
  --------------------------------------------------------- */

  useEffect(() => {
    if (search.length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)
    const controller = new AbortController()
    const timeout = setTimeout(() => {
      fetch(`/api/football/search?q=${encodeURIComponent(search)}`, {
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(data => {
          const leagues =
            data.leagues?.map((l: any) => ({
              type: "league",
              id: l.idLeague,
              name: l.strLeague,
            })) ?? []

          const teams =
            data.teams?.map((t: any) => ({
              type: "team",
              id: t.idTeam,
              name: t.strTeam,
            })) ?? []

          setResults([...leagues, ...teams])
        })
        .catch(() => {})
        .finally(() => setSearching(false))
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [search])

  /* ---------------------------------------------------------
     LEAGUE SELECT
  --------------------------------------------------------- */

  async function selectLeague(id: string) {
    setLeagueId(id)
    setTable([])
    setTeam(null)
    setLoadingTable(true)

    const res = await fetch(`/api/football/league?id=${id}`)
    const data = await res.json()

    setLeagueName(data.strLeague ?? "")

    const tableRes = await fetch(
      `/api/football/table?leagueId=${id}`
    )
    const tableData = await tableRes.json()

    setTable(tableData.rows ?? [])
    setLoadingTable(false)

    if (tableData.rows?.length) {
      selectTeam(tableData.rows[0].teamId)
    }
  }

  /* ---------------------------------------------------------
     TEAM SELECT
  --------------------------------------------------------- */

  async function selectTeam(id: string) {
    setLoadingTeam(true)
    const res = await fetch(`/api/football/team?id=${id}`)
    const data = await res.json()
    setTeam(data)
    setLoadingTeam(false)
  }

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search leagues or teams…"
          className="w-full rounded-md border border-smfc-gold bg-smfc-black px-3 py-2 text-smfc-white"
        />

        {search.length >= 2 && (
          <div className="mt-2 rounded-md border border-smfc-gold bg-smfc-black">
            {searching && (
              <div className="p-2 text-sm text-smfc-gold">
                Searching…
              </div>
            )}

            {!searching && results.length === 0 && (
              <div className="p-2 text-sm text-smfc-muted">
                No results
              </div>
            )}

            {results.map(r => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => {
                  setSearch("")
                  setResults([])
                  r.type === "league"
                    ? selectLeague(r.id)
                    : selectTeam(r.id)
                }}
                className="block w-full px-3 py-2 text-left hover:bg-smfc-gold hover:text-black"
              >
                <span className="mr-2 text-xs opacity-70">
                  {r.type === "league" ? "League" : "Team"}
                </span>
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LEAGUE TABLE */}
      {leagueId && (
        <div className="rounded-md border border-smfc-gold p-3">
          <h2 className="mb-2 text-smfc-gold font-bold">
            {leagueName}
          </h2>

          {loadingTable && (
            <div className="text-sm text-smfc-muted">
              Loading table…
            </div>
          )}

          {!loadingTable &&
            table.map(row => (
              <button
                key={row.teamId}
                onClick={() => selectTeam(row.teamId)}
                className="flex w-full items-center gap-2 px-2 py-1 text-left hover:bg-smfc-gold hover:text-black"
              >
                <span className="w-6">{row.position}</span>
                <img
                  src={row.crest}
                  alt=""
                  className="h-5 w-5"
                />
                <span className="flex-1">
                  {row.teamName}
                </span>
                <span>{row.points}</span>
              </button>
            ))}
        </div>
      )}

      {/* TEAM INFO */}
      {team && (
        <div className="rounded-md border border-smfc-gold p-3">
          {loadingTeam && (
            <div className="text-sm text-smfc-muted">
              Loading team…
            </div>
          )}

          {!loadingTeam && (
            <>
              <div className="flex items-center gap-3">
                {team.strTeamBadge && (
                  <img
                    src={team.strTeamBadge}
                    alt=""
                    className="h-12 w-12"
                  />
                )}
                <div>
                  <h3 className="font-bold text-smfc-gold">
                    {team.strTeam}
                  </h3>
                  <p className="text-sm text-smfc-muted">
                    {team.strLeague}
                  </p>
                </div>
              </div>

              {team.strStadium && (
                <p className="mt-2 text-sm">
                  Stadium: {team.strStadium}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
