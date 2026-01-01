import ResultCard from "./ResultCard"
import { LiveMatch } from "./types"

export default function PinnedMatches({
  matches,
  onTogglePin,
}: {
  matches: LiveMatch[]
  onTogglePin: (id: string) => void
}) {
  if (matches.length === 0) return null

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-semibold">📌 Pinned</h3>
      {matches.map(m => (
        <ResultCard
          key={m.matchId}
          match={m}
          pinned
          onTogglePin={onTogglePin}
        />
      ))}
    </section>
  )
}
