"use client"

import { useEffect, useState } from "react"
import OutputThreeSkeleton from "./OutputThreeSkeleton"

export default function OutputThree() {
  const [loading, setLoading] = useState(true)

  const heritage = [
    {
      name: "statistics.gov.scot",
      badge: "Open data",
      copy:
        "250+ linked-data collections with demographics, economics and health across Scotland. All datasets are machine-readable under the OGL licence.",
    },
    {
      name: "Historic Environment Scotland WFS",
      badge: "Heritage layers",
      copy:
        "Web Feature Services for listed buildings, scheduled monuments and battlefields. Downloadable or queryable for mapping overlays.",
    },
    {
      name: "NLS Historic Maps API",
      badge: "Map tiles",
      copy:
        "Free georeferenced 1920s–1940s OS map layer from the National Library of Scotland. Perfect for historic basemaps.",
    },
    {
      name: "NLS Boundaries Viewer",
      badge: "Context",
      copy:
        "Interactive viewer for historic counties, parishes and modern admin boundaries—embed or deep-link to give place context.",
    },
  ]

  const combos = [
    {
      title: "Heritage mashup",
      detail:
        "Overlay HES listed buildings on the NLS historic map tiles to create a tap-to-explore layer for local walks.",
    },
    {
      title: "Local story card",
      detail:
        "Pull population or employment stats from statistics.gov.scot for a chosen council area and pin nearby monuments from the WFS feed.",
    },
    {
      title: "Boundary explorer",
      detail:
        "Link to the NLS Boundaries Viewer from team pages so users can see historic county lines for rival clubs.",
    },
  ]

  const routing = {
    name: "OpenRouteService",
    detail:
      "Open-source routing, geocoding, isochrones and elevation on the free tier (500 isochrones/day). Ideal for a distance card between two Scottish towns.",
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <OutputThreeSkeleton />

  return (
    <div className="space-y-4 animate-fade-in">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-smfc-red">
          Scotland Explorer
        </p>
        <h2 className="text-xl font-semibold">Maps, heritage & story cards</h2>
        <p className="text-sm text-neutral-400">
          Curated sources from the suggestions doc to add Scottish history and
          place context alongside the sports feed.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {heritage.map((item) => (
          <article
            key={item.name}
            className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-base">{item.name}</h3>
              <span className="rounded-full bg-smfc-red/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-smfc-red">
                {item.badge}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              {item.copy}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">Ready-made combos</h4>
          <span className="text-[11px] uppercase tracking-wide text-neutral-400">
            Mobile-first
          </span>
        </div>
        <div className="space-y-3">
          {combos.map((combo) => (
            <div
              key={combo.title}
              className="rounded-lg bg-smfc-black/50 p-3 border border-smfc-grey/50"
            >
              <p className="text-sm font-semibold text-smfc-white">
                {combo.title}
              </p>
              <p className="text-sm text-neutral-300 mt-1 leading-relaxed">
                {combo.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4 flex items-start gap-3">
        <div className="mt-1 h-10 w-10 rounded-full bg-smfc-red/20 text-smfc-red flex items-center justify-center font-bold text-lg">
          🚗
        </div>
        <div className="space-y-1">
          <p className="text-sm uppercase tracking-[0.18em] text-smfc-red">
            Distance + routing
          </p>
          <h4 className="text-lg font-semibold">{routing.name}</h4>
          <p className="text-sm text-neutral-300 leading-relaxed">
            {routing.detail}
          </p>
          <p className="text-xs text-neutral-400">
            Pair with the NLS map tiles to show a historic basemap under the
            modern route line.
          </p>
        </div>
      </div>
    </div>
  )
}
