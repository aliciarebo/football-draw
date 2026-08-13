import { CreateSeasonPredictionRequest } from "../models/create-season-prediction-request.model";
import { SeasonPrediction } from "../models/season-prediction.model";

export function mapSeasonPredictionToRequest(prediction: SeasonPrediction): CreateSeasonPredictionRequest {
    const request: CreateSeasonPredictionRequest = {
        championsLeagueWinnerId: prediction.championsLeagueWinner.id,
        championsLeagueWinnerName: prediction.championsLeagueWinner.clubName,
        
        laLigaWinnerId: prediction.laLigaWinner.id,
        laLigaWinnerName: prediction.laLigaWinner.clubName,

        copaReyWinnerId: prediction.copaReyWinner.id,
        copaReyWinnerName: prediction.copaReyWinner.clubName,

        superCopaWinnerId: prediction.superCopaWinner.id,
        superCopaWinnerName: prediction.superCopaWinner.clubName,

        topScorerId: prediction.topScorer.id,
        topScorerName: prediction.topScorer.name,

        standOutPlayerId: prediction.standOutPlayer.id,
        standOutPlayerName: prediction.standOutPlayer.name,

        disappointmentPlayerId: prediction.disappointmentPlayer.id,
        disappointmentPlayerName: prediction.disappointmentPlayer.name,

        ballondOrId: prediction.ballondOr.id,
        ballondOrName: prediction.ballondOr.name,

        goldenBootId: prediction.goldenBoot.id,
        goldenBootName: prediction.goldenBoot.name,

        zamoraWinnerId: prediction.zamoraWinner.id,
        zamoraWinnerName: prediction.zamoraWinner.name
       }
    return request;
}