export type SearchSuggestion =
  | {
      type: "league"
      idLeague: string
      label: string
    }
  | {
      type: "team"
      idTeam: string
      idLeague: string
      label: string
    }
