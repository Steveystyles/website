"use client"

import { useEffect, useState } from "react"
import OutputFourSkeleton from "./OutputFourSkeleton"

export default function OutputFour() {
  const [loading, setLoading] = useState(true)

  const puzzleApis = [
    {
      name: "Shadify Puzzle API",
      badge: "Crossword • Sudoku • Word search",
      detail:
        "Open-source HTTP API that generates grids and can validate solutions. Self-host for zero cost daily puzzles.",
    },
    {
      name: "Free Dictionary API",
      badge: "Definitions & pronunciation",
      detail:
        "Dictionary lookups with audio, synonyms and origins. Great for hints or a 'word of the day' card.",
    },
    {
      name: "Datamuse",
      badge: "Word finder",
      detail:
        "No API token needed. Returns rhymes, synonyms and pattern matches to auto-generate clue lists.",
    },
    {
      name: "Wordnik (free plan)",
      badge: "Examples & random words",
      detail:
        "100 calls/hour for free, covering definitions, example sentences and random words for quiz prompts.",
    },
    {
      name: "Numbers API",
      badge: "Trivia",
      detail:
        "Returns facts for numbers, dates or years—ideal for a 'fun fact' tile alongside puzzles.",
    },
  ]

  const cadence = [
    "Morning: rotate a Sudoku or crossword grid from Shadify.",
    "Midday: show a 'word of the day' with Free Dictionary audio + Datamuse rhymes.",
    "Evening: drop a Numbers API fact next to the sports results.",
  ]

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <OutputFourSkeleton />

  return (
    <div className="space-y-4 animate-fade-in">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.2em] text-smfc-red">
          Wordplay & trivia
        </p>
        <h2 className="text-xl font-semibold">Puzzle-ready APIs</h2>
        <p className="text-sm text-neutral-400">
          Free puzzle, dictionary and trivia sources from the suggestions doc
          for lightweight, mobile-friendly widgets.
        </p>
      </header>

      <div className="space-y-3">
        {puzzleApis.map((api) => (
          <article
            key={api.name}
            className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-smfc-red font-semibold">
                  {api.badge}
                </p>
                <h3 className="text-base font-semibold mt-1">{api.name}</h3>
              </div>
              <span className="rounded-full bg-smfc-black px-3 py-1 text-[11px] text-neutral-300 border border-smfc-grey/70">
                Free tier
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
              {api.detail}
            </p>
          </article>
        ))}
      </div>

      <div className="rounded-xl border border-smfc-grey bg-neutral-900/80 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-smfc-red/20 text-smfc-red flex items-center justify-center text-lg">
            ⏱️
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-neutral-400">
              Daily rhythm
            </p>
            <h4 className="text-sm font-semibold">Keep it fresh on mobile</h4>
          </div>
        </div>
        <ul className="space-y-2">
          {cadence.map((item) => (
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
