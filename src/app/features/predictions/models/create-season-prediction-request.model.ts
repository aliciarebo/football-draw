export interface CreateSeasonPredictionRequest {
  championsLeagueWinnerId: number;
  championsLeagueWinnerName: string;

  laLigaWinnerId: number;
  laLigaWinnerName: string;

  copaReyWinnerId: number;
  copaReyWinnerName: string;

  superCopaWinnerId: number;
  superCopaWinnerName: string;

  topScorerId: number;
  topScorerName: string;

  standOutPlayerId: number;
  standOutPlayerName: string;

  disappointmentPlayerId: number;
  disappointmentPlayerName: string;

  ballondOrId: number;
  ballondOrName: string;

  goldenBootId: number;
  goldenBootName: string;

  zamoraWinnerId: number;
  zamoraWinnerName: string;
}