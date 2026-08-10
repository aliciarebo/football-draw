import { User } from "../../home/models/user-prediction.model";
import { Player } from "../../predictions/models/player.model";
import { Team } from "../../predictions/models/team-model";

export interface SeasonResults {
  laLigaWinner: Team | null;
  championsLeagueWinner: Team | null;
  copaReyWinner: Team | null;
  superCopaWinner: Team | null;
  topScorer: Player | null;
  standOutPlayer: Player | null;
  disappointmentPlayer: Player | null;
  ballondOr: Player | null;
  goldenBoot: Player | null;
  zamoraWinner: Player | null;
}
export interface ScoreBreakdown {
  label: string;
  points: number;
  correct: boolean | null;
}

export interface UserScore {
  user: User;
  points: number;
  correctPredictions: number;
  totalPredictions: number;
  breakdown: ScoreBreakdown[];
}