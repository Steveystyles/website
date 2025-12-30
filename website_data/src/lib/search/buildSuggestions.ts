import { SoccerIndex } from "@/lib/data/soccerIndex"
import { SearchSuggestion } from "./types"

/**
 * Build search suggestions for football (soccer) leagues + teams only.
 * Explicitly excludes:
 * - Non-soccer sports
 * - _No League entries
 * - Cups / trophies / friendlies / qualifiers
 */
export function buildSuggestions(
  query: string,
  index: SoccerIndex,
  limit = 10
): SearchSuggestion[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const results: SearchSuggestion[] = []

  const EXCLUDED_LEAGUE_REGEX =
    /cup|trophy|friendly|friendlies|qualifying|qualification|playoff|play-offs|super\s?cup|shield/i

  for (const league of index) {
    // 🚫 HARD EXCLUSIONS
    if (
      !league.name ||
      league.name === "_No League" ||
      EXCLUDED_LEAGUE_REGEX.test(league.name)
    ) {
      continue
    }

    // 🚫 Defensive: ignore leagues with no teams
    if (!league.teams || league.teams.length === 0) {
      continue
    }

    // ✅ League match
    if (league.name.toLowerCase().includes(q)) {
      results.push({
        type: "league",
        idLeague: league.idLeague,
        label: league.name,
      })
    }

    // ✅ Team matches (only from valid leagues)
    for (const team of league.teams) {
      if (!team.name) continue

      if (team.name.toLowerCase().includes(q)) {
        results.push({
          type: "team",
          idTeam: team.idTeam,
          idLeague: league.idLeague,
          label: `${team.name} (${league.name})`,
        })
      }

      if (results.length >= limit) break
    }

    if (results.length >= limit) break
  }

  return results.slice(0, limit)
}
