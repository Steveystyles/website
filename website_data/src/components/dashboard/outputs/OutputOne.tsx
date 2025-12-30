import FootballExplorer from "@/components/football/FootballExplorer"
import { SoccerIndex } from "@/lib/data/soccerIndex"

export default function OutputOne({
  soccerIndex,
}: {
  soccerIndex: SoccerIndex
}) {
  return <FootballExplorer index={soccerIndex} />
}
