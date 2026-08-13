import { UserPrediction, UserPredictionResponse } from "../../home/models/user-prediction.model";

export function mapUserPredictionResponse(response: UserPredictionResponse): UserPrediction {
  return {
    user: response.user,

    seasonPrediction: {
      championsLeagueWinner: {
        id: response.seasonPrediction.championsLeagueWinnerId,
        clubName: response.seasonPrediction.championsLeagueWinnerName
      },

      laLigaWinner: {
        id: response.seasonPrediction.laLigaWinnerId,
        clubName: response.seasonPrediction.laLigaWinnerName
      },

      copaReyWinner: {
        id: response.seasonPrediction.copaReyWinnerId,
        clubName: response.seasonPrediction.copaReyWinnerName
      },

      superCopaWinner: {
        id: response.seasonPrediction.superCopaWinnerId,
        clubName: response.seasonPrediction.superCopaWinnerName
      },

      topScorer: {
        id: response.seasonPrediction.topScorerId,
        name: response.seasonPrediction.topScorerName,
        position: null
      },

      standOutPlayer: {
        id: response.seasonPrediction.standOutPlayerId,
        name: response.seasonPrediction.standOutPlayerName,
        position: null
      },

      disappointmentPlayer: {
        id: response.seasonPrediction.disappointmentPlayerId,
        name: response.seasonPrediction.disappointmentPlayerName,
        position: null
      },

      ballondOr: {
        id: response.seasonPrediction.ballondOrId,
        name: response.seasonPrediction.ballondOrName,
        position: null
      },

      goldenBoot: {
        id: response.seasonPrediction.goldenBootId,
        name: response.seasonPrediction.goldenBootName,
        position: null
      },

      zamoraWinner: {
        id: response.seasonPrediction.zamoraWinnerId,
        name: response.seasonPrediction.zamoraWinnerName,
        position: null
      }
    },
    createdAt: response.createdAt,
    updatedAt: response.updatedAt
  };
}