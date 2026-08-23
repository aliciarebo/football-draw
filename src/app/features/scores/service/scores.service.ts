import { Injectable, signal } from '@angular/core';
import {
  ScoreBreakdown,
  SeasonResults,
  UserScore
} from '../models/season-result.model';
import { Team } from '../../predictions/models/team-model';
import { UserPrediction } from '../../home/models/user-prediction.model';
import { Player } from '../../predictions/models/player.model';

@Injectable({
  providedIn: 'root',
})
export class ScoresService {
  private readonly SCORE_RULES = {
    laLigaWinner: 10,
    championsLeagueWinner: 15,
    copaReyWinner: 8,
    superCopaWinner: 5,
    topScorer: 10,
    standOutPlayer: 15,
    disappointmentPlayer: 15,
    ballondOr: 15,
    goldenBoot: 10,
    zamoraWinner: 10
  };

 calculateScores(
  predictions: UserPrediction[],
  realWinners: SeasonResults
): UserScore[] {

  const scores = predictions.map((prediction) => {
    let points = 0;
    let correctPredictions = 0;

    const breakdown: ScoreBreakdown[] = [];

    const laLigaCorrect = realWinners.laLigaWinner
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.laLigaWinner,
          realWinners.laLigaWinner
        )
      : null;

    breakdown.push({
      label: 'LaLiga',
      points: laLigaCorrect
        ? this.SCORE_RULES.laLigaWinner
        : 0,
      correct: laLigaCorrect
    });

    if (laLigaCorrect) {
      points += this.SCORE_RULES.laLigaWinner;
      correctPredictions++;
    }


    const championsCorrect = realWinners.championsLeagueWinner
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.championsLeagueWinner,
          realWinners.championsLeagueWinner
        )
      : null;

    breakdown.push({
      label: 'Champions League',
      points: championsCorrect
        ? this.SCORE_RULES.championsLeagueWinner
        : 0,
      correct: championsCorrect
    });

    if (championsCorrect) {
      points += this.SCORE_RULES.championsLeagueWinner;
      correctPredictions++;
    }


    const copaReyCorrect = realWinners.copaReyWinner
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.copaReyWinner,
          realWinners.copaReyWinner
        )
      : null;

    breakdown.push({
      label: 'Copa del Rey',
      points: copaReyCorrect
        ? this.SCORE_RULES.copaReyWinner
        : 0,
      correct: copaReyCorrect
    });

    if (copaReyCorrect) {
      points += this.SCORE_RULES.copaReyWinner;
      correctPredictions++;
    }


    const superCopaCorrect = realWinners.superCopaWinner
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.superCopaWinner,
          realWinners.superCopaWinner
        )
      : null;

    breakdown.push({
      label: 'Supercopa',
      points: superCopaCorrect
        ? this.SCORE_RULES.superCopaWinner
        : 0,
      correct: superCopaCorrect
    });

    if (superCopaCorrect) {
      points += this.SCORE_RULES.superCopaWinner;
      correctPredictions++;
    }


    const topScorerCorrect = realWinners.topScorer
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.topScorer,
          realWinners.topScorer
        )
      : null;

    breakdown.push({
      label: 'Pichichi',
      points: topScorerCorrect
        ? this.SCORE_RULES.topScorer
        : 0,
      correct: topScorerCorrect
    });

    if (topScorerCorrect) {
      points += this.SCORE_RULES.topScorer;
      correctPredictions++;
    }


    const standOutPlayerCorrect = realWinners.standOutPlayer
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.standOutPlayer,
          realWinners.standOutPlayer
        )
      : null;

    breakdown.push({
      label: 'Jugador revelación',
      points: standOutPlayerCorrect
        ? this.SCORE_RULES.standOutPlayer
        : 0,
      correct: standOutPlayerCorrect
    });

    if (standOutPlayerCorrect) {
      points += this.SCORE_RULES.standOutPlayer;
      correctPredictions++;
    }


    const disappointmentPlayerCorrect =
      realWinners.disappointmentPlayer
        ? this.isCorrectPrediction(
            prediction.seasonPrediction.disappointmentPlayer,
            realWinners.disappointmentPlayer
          )
        : null;

    breakdown.push({
      label: 'Jugador decepción',
      points: disappointmentPlayerCorrect
        ? this.SCORE_RULES.disappointmentPlayer
        : 0,
      correct: disappointmentPlayerCorrect
    });

    if (disappointmentPlayerCorrect) {
      points += this.SCORE_RULES.disappointmentPlayer;
      correctPredictions++;
    }


    const ballonDorCorrect = realWinners.ballondOr
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.ballondOr,
          realWinners.ballondOr
        )
      : null;

    breakdown.push({
      label: 'Balón de Oro',
      points: ballonDorCorrect
        ? this.SCORE_RULES.ballondOr
        : 0,
      correct: ballonDorCorrect
    });

    if (ballonDorCorrect) {
      points += this.SCORE_RULES.ballondOr;
      correctPredictions++;
    }


    const goldenBootCorrect = realWinners.goldenBoot
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.goldenBoot,
          realWinners.goldenBoot
        )
      : null;

    breakdown.push({
      label: 'Bota de Oro',
      points: goldenBootCorrect
        ? this.SCORE_RULES.goldenBoot
        : 0,
      correct: goldenBootCorrect
    });

    if (goldenBootCorrect) {
      points += this.SCORE_RULES.goldenBoot;
      correctPredictions++;
    }


    const zamoraCorrect = realWinners.zamoraWinner
      ? this.isCorrectPrediction(
          prediction.seasonPrediction.zamoraWinner,
          realWinners.zamoraWinner
        )
      : null;

    breakdown.push({
      label: 'Trofeo Zamora',
      points: zamoraCorrect
        ? this.SCORE_RULES.zamoraWinner
        : 0,
      correct: zamoraCorrect
    });

    if (zamoraCorrect) {
      points += this.SCORE_RULES.zamoraWinner;
      correctPredictions++;
    }


    return {
      user: prediction.user,
      points,
      correctPredictions,
      totalPredictions: 10,
      breakdown
    };
  });

  return scores.sort(
    (firstScore, secondScore) =>
      secondScore.points - firstScore.points
  );
}

  private isCorrectPrediction(
    predicted: Team | Player,
    result: Team | Player | null
  ): boolean {
    return result !== null && predicted.id === result.id;
  }
}