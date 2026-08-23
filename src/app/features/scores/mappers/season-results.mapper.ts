import { SeasonResults, SeasonResultsResponse } from "../models/season-result.model";

export function mapSeasonResultsResponse(response: SeasonResultsResponse): SeasonResults{
    return {
    laLigaWinner: response.laLigaWinnerId && response.laLigaWinnerName
      ? {
          id: response.laLigaWinnerId,
          clubName: response.laLigaWinnerName,
          shortName: response.laLigaWinnerName
        }
      : null,

    championsLeagueWinner:
      response.championsLeagueWinnerId &&
      response.championsLeagueWinnerName
        ? {
            id: response.championsLeagueWinnerId,
            clubName: response.championsLeagueWinnerName,
            shortName: response.championsLeagueWinnerName
          }
        : null,

    copaReyWinner:
      response.copaReyWinnerId &&
      response.copaReyWinnerName
        ? {
            id: response.copaReyWinnerId,
            clubName: response.copaReyWinnerName,
            shortName: response.copaReyWinnerName
          }
        : null,

    superCopaWinner:
      response.superCopaWinnerId &&
      response.superCopaWinnerName
        ? {
            id: response.superCopaWinnerId,
            clubName: response.superCopaWinnerName,
            shortName: response.superCopaWinnerName
          }
        : null,

    topScorer:
      response.topScorerId && response.topScorerName
        ? {
            id: response.topScorerId,
            name: response.topScorerName,
            position: null
          }
        : null,

    standOutPlayer:
      response.standOutPlayerId && response.standOutPlayerName
        ? {
            id: response.standOutPlayerId,
            name: response.standOutPlayerName,
            position: null
          }
        : null,

    disappointmentPlayer:
      response.disappointmentPlayerId &&
      response.disappointmentPlayerName
        ? {
            id: response.disappointmentPlayerId,
            name: response.disappointmentPlayerName,
            position: null
          }
        : null,

    ballondOr:
      response.ballondOrId && response.ballondOrName
        ? {
            id: response.ballondOrId,
            name: response.ballondOrName,
            position: null
          }
        : null,

    goldenBoot:
      response.goldenBootId && response.goldenBootName
        ? {
            id: response.goldenBootId,
            name: response.goldenBootName,
            position: null
          }
        : null,

    zamoraWinner:
      response.zamoraWinnerId && response.zamoraWinnerName
        ? {
            id: response.zamoraWinnerId,
            name: response.zamoraWinnerName,
            position: null
          }
        : null
  };
}