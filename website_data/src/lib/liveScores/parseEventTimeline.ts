export type TimelineEvent = {
  type: "goal" | "card" | "sub"
  minute: number
  team: "home" | "away"
  player: string
  assist?: string
  cardType?: "yellow" | "red"
}

export function parseEventTimeline(data: any): TimelineEvent[] {
  if (data?.Message === "No data found") {
    return []
  }

  const rows = data?.lookup
  if (!Array.isArray(rows)) return []

  return rows
    .map((e: any): TimelineEvent | null => {
      const minute = Number(e.intTime)
      if (!Number.isFinite(minute)) return null

      const team = e.strHome === "Yes" ? "home" : "away"

      if (e.strTimeline === "Goal") {
        return {
          type: "goal",
          minute,
          team,
          player: e.strPlayer,
          assist: e.strAssist || undefined,
        }
      }

      if (e.strTimeline === "Card") {
        return {
          type: "card",
          minute,
          team,
          player: e.strPlayer,
          cardType:
            e.strTimelineDetail?.toLowerCase().includes("red")
              ? "red"
              : "yellow",
        }
      }

      if (e.strTimeline === "subst") {
        return {
          type: "sub",
          minute,
          team,
          player: e.strPlayer,
          assist: e.strAssist || undefined,
        }
      }

      return null
    })
    .filter(Boolean)
    .sort((a, b) => a!.minute - b!.minute) as TimelineEvent[]
}

