"use client"

import { useEffect, useState } from "react"
import OutputTwoSkeleton from "./OutputTwoSkeleton"

export default function OutputTwo() {
  const [loading, setLoading] = useState(true)

  const sportsApis = [
    {
      name: "TheSportsDB",
      badge: "Fixtures + highlights",
      description:
        "Free key (e.g., 123) for hobby use. Grab upcoming fixtures, recent results and YouTube highlights with eventsnext / eventslast endpoints.",
    },
    {
      name: "Football-Data.org",
      badge: "Scottish leagues",
      description:
        "Fixtures, results, standings and scorers for the Scottish Premiership & Cup on the free tier (rate limited but no subscription).",
    },
    {
      name: "SportMonks (free tier)",
      badge: "Live stats",
      description:
        "Scottish Premiership is fully available on the free plan: live scores, fixtures, standings plus standard and advanced player stats.",
    },
    {
      name: "Open-source datasets",
      badge: "Historical results",
      description:
        "CSV results from football-data.co.uk and other open datasets you can download and visualise without an API key.",
    },
  ]

  const quickWins = [
    "St Mirren next-up widget: call eventsnext.php and show kickoff + venue.",
    "League ladder: Football-Data.org standings endpoint for Scottish Premiership.",
    "Last 5 form chips: SportMonks recent results → W/D/L dots.",
    "Historic trendline: plot open CSV results to show season-to-season points.",
  ]

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <OutputTwoSkeleton />

  return (
    <div className="space-y-4 animate-fade-in">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-smfc-red">
          Sports Data Picks
        </p>
        <h2 className="text-xl font-semibold">Feed-ready APIs & datasets</h2>
        <p className="text-sm text-neutral-400">
          Free sources from the suggestions doc to power scores, tables and
          highlights for a mobile-first experience.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sportsApis.map((api) => (
          <article
            key={api.name}
            className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold">{api.name}</h3>
              <span className="rounded-full bg-smfc-red/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-smfc-red">
                {api.badge}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              {api.description}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4">
        <h4 className="text-sm font-semibold text-smfc-white">
          Quick drop-ins
        </h4>
        <p className="text-xs text-neutral-400 mb-3">
          Ready-to-build cards for the dashboard.
        </p>
        <ul className="space-y-2">
          {quickWins.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-lg bg-smfc-black/50 p-3 text-sm leading-relaxed"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-smfc-red" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
