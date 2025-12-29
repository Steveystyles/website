"use client"

import { useEffect, useState } from "react"

type Result = {
  id: string
  name: string
  type: "league" | "team"
  badge?: string
  league_id?: string
}

export default function FootballExplorer() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Result[]>([])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const controller = new AbortController()

    fetch(`/api/football/search-local?q=${query}`, {
      signal: controller.signal,
    })
      .then(r => r.json())
      .then(d => setResults(d.results ?? []))
      .catch(() => {})

    return () => controller.abort()
  }, [query])

  return (
    <div className="max-w-md mx-auto p-4">
      <input
        className="w-full p-2 border rounded"
        placeholder="Search leagues or teams…"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      <ul className="mt-2 space-y-1">
        {results.map(r => (
          <li
            key={r.id}
            className="p-2 bg-white border rounded cursor-pointer"
          >
            <span className="font-semibold">{r.name}</span>
            <span className="ml-2 text-sm opacity-60">
              {r.type}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
