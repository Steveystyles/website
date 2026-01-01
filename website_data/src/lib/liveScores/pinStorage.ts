const KEY = "pinnedMatches"

export function getPinnedIds(): string[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(KEY) || "[]")
}

export function togglePin(matchId: string) {
  const pins = getPinnedIds()
  const next = pins.includes(matchId)
    ? pins.filter(id => id !== matchId)
    : [...pins, matchId]

  localStorage.setItem(KEY, JSON.stringify(next))
}
