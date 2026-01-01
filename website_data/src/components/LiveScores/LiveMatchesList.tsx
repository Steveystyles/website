import ResultCard from "./ResultCard"
import { LiveMatch } from "./types"

export default function LiveMatchesList({
  matches,
  pinnedIds,
  onTogglePin,
  loading,
}: {
  matches: LiveMatch[]
  pinnedIds: string[]
  onTogglePin: (id: string) => void
  loading: boolean
}) {
  if (loading) {
    return <div className="text-sm opacity-70">Loading live scores…</div>
  }
  if (!loading && matches.length === 0) {
  return (
    <div className="text-sm text-muted-foreground">
      No live matches for this selection.
    </div>
  )
  }
  return (
    <section>
      <h3 className="text-sm font-semibold text-muted-foreground mb-2">
        ⚽ Live Scores
      </h3>

      <div className="space-y-2">
        {matches.map(match => (
          <ResultCard
            key={match.matchId}
            match={match}
            pinned={pinnedIds.includes(match.matchId)}
            onTogglePin={onTogglePin}
          />
        ))}
      </div>
    </section>
  )
}
