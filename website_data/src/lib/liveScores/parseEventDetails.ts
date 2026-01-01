export type MatchEventDetails = {
  goals: {
    team: "home" | "away"
    player: string
    minute: string
  }[]
  cards: {
    team: "home" | "away"
    player: string
    minute: string
    type: "yellow" | "red"
  }[]
  subs: {
    team: "home" | "away"
    detail: string
    minute: string
  }[]
}

function parseList(
  raw: string | null | undefined,
  team: "home" | "away"
) {
  if (!raw) return []

  return raw
    .split(";")
    .map(s => s.trim())
    .filter(Boolean)
    .map(entry => {
      // usually: "Player 67'"
      const match = entry.match(/^(.*?)(\d+.*)$/)
      return {
        team,
        player: match?.[1]?.trim() ?? entry,
        minute: match?.[2]?.trim() ?? "",
      }
    })
}

export function parseEventDetails(apiData: any): MatchEventDetails {
  const e = apiData?.lookup?.[0]
  if (!e) {
    return { goals: [], cards: [], subs: [] }
  }

  const goals = [
    ...parseList(e.strHomeGoalDetails, "home"),
    ...parseList(e.strAwayGoalDetails, "away"),
  ]

  const yellowCards = [
    ...parseList(e.strHomeYellowCards, "home").map(c => ({
      ...c,
      type: "yellow" as const,
    })),
    ...parseList(e.strAwayYellowCards, "away").map(c => ({
      ...c,
      type: "yellow" as const,
    })),
  ]

  const redCards = [
    ...parseList(e.strHomeRedCards, "home").map(c => ({
      ...c,
      type: "red" as const,
    })),
    ...parseList(e.strAwayRedCards, "away").map(c => ({
      ...c,
      type: "red" as const,
    })),
  ]

  const subs = [
    ...parseList(e.strHomeSubDetails, "home"),
    ...parseList(e.strAwaySubDetails, "away"),
  ]

  return {
    goals,
    cards: [...yellowCards, ...redCards],
    subs,
  }
}
