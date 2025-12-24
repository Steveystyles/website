"use client"

import { useEffect, useState } from "react"

type League = {
  id: string
  name: string
  season: string
}

type Props = {
  onChange: (leagueId: string, season: string, leagueName: string) => void
}

export default function LeagueSelector({ onChange }: Props) {
  const [leagues, setLeagues] = useState<League[]>([])
  const [leagueId, setLeagueId] = useState("")

  useEffect(() => {
    fetch("/api/football/leagues")
      .then(async (r) => {
        const text = await r.text()
        return text ? JSON.parse(text) : []
      })
      .then((data: League[]) => {
        setLeagues(data)

        // 🇸🇨 Auto-select Scottish league
        const scottish =
          data.find((l) =>
            l.name.toLowerCase().includes("scottish")
          ) ?? data[0]

        if (scottish) {
          setLeagueId(scottish.id)
          onChange(scottish.id, scottish.season, scottish.name)
        }
      })
      .catch(() => setLeagues([]))
  }, [onChange])

  return (
    <div className="rounded-xl border border-smfc-grey bg-smfc-charcoal p-4 shadow-lg shadow-black/30">
      <label className="block text-sm font-semibold text-neutral-300 mb-2">
        Select League
      </label>

      <select
        value={leagueId}
        onChange={(e) => {
          const league = leagues.find(
            (l) => l.id === e.target.value
          )
          if (league) {
            setLeagueId(league.id)
            onChange(
              league.id,
              league.season,
              league.name
            )
          }
        }}
        className="w-full rounded-lg bg-smfc-black border border-smfc-grey p-2 text-smfc-white"
      >
        {leagues.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  )
}
