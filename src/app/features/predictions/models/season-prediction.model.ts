import { Player } from "./player.model";
import { Team } from "./team-model";

export interface SeasonPrediction{
    championsLeagueWinner: Team,
    laLigaWinner: Team,
    copaReyWinner: Team,
    superCopaWinner: Team,
    topScorer: Player
    standOutPlayer: Player,
    disappointmentPlayer: Player,
    ballondOr: Player,
    goldenBoot: Player,
    zamoraWinner: Player
}