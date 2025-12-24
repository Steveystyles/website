"use client"

import { useEffect, useRef, useState } from "react"
import LeagueTable from "./LeagueTable"
import TeamSnapshot from "./TeamSnapshot"
import OnThisDay from "./OnThisDay"
import LeagueSelector from "./LeagueSelector"

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

export default function FootballExplorer() {
  const [rows, setRows] = useState<LeagueRow[]>([])
  const [leagueName, setLeagueName] = useState("")
  const [leagueId, setLeagueId] = useState("")
  const [season, setSeason] = useState("")
  const [teamId, setTeamId] = useState("")
  const [loading, setLoading] = useState(true)

  const detailsRef = useRef<HTMLDivElement | null>(null)

  // 🔁 Fetch league table
  useEffect(() => {
    if (!leagueId || !season) return

    let alive = true
    setLoading(true)

    fetch(
      `/api/football/table?leagueId=${leagueId}&season=${season}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (!alive) return

        setRows(data.rows ?? [])
        setLeagueName(data.leagueName ?? "")

        // 🔴 Auto-select St Mirren
        const stMirren = data.rows?.find((r: LeagueRow) =>
          r.teamName.toLowerCase().includes("st mirren")
        )

        if (stMirren) {
          setTeamId(stMirren.teamId)
        }
      })
      .finally(() => alive && setLoading(false))

    return () => {
      alive = false
    }
  }, [leagueId, season])

  // Auto-scroll to details
  useEffect(() => {
    if (teamId) {
      detailsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [teamId])

  return (
    <section className="space-y-5">
      <LeagueSelector
        onChange={(id, season, name) => {
          setLeagueId(id)
          setSeason(season)
          setLeagueName(name)
          setTeamId("") // reset before auto-select
        }}
      />

      {loading ? (
        <div className="text-sm text-neutral-400">
          Loading league table…
        </div>
      ) : (
        <LeagueTable
          leagueName={leagueName}
          rows={rows}
          selectedTeamId={teamId}
          onSelectTeam={setTeamId}
        />
      )}

      <div ref={detailsRef} className="space-y-4">
        {teamId ? (
          <>
            <TeamSnapshot teamId={teamId} />
            <OnThisDay teamId={teamId} />
          </>
        ) : (
          <div className="text-sm text-neutral-400 italic">
            Select a team to view details
          </div>
        )}
      </div>
    </section>
  )
}
