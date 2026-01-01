export type MatchStatus = "LIVE" | "FT" | "NS"

export type LiveMatch = {
  matchId: string
  eventId?: string
  home: string
  away: string
  homeScore: number
  awayScore: number
  status: MatchStatus
  minute?: number
  league: string
  country: string
  kickoff?: string
  homeBadge?: string
  awayBadge?: string
}


export type MatchEventDetail = {
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

export type PinnedMatch = {
  matchId: string
  pinnedAt: number
}
