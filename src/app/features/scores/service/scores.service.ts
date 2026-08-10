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
  private readonly storageKey = 'season-results';
  private readonly seasonResultsState = signal<SeasonResults>(this.loadResults());
  readonly seasonResult = this.seasonResultsState.asReadonly();
  

  loadResults(): SeasonResults {
      const savedResults = localStorage.getItem(this.storageKey);

      if (!savedResults) {
        return this.getEmptyResults();
      }

      try {
        return JSON.parse(savedResults);
      } catch {
          localStorage.removeItem(this.storageKey);
          return this.getEmptyResults();
      }
  }

  private getEmptyResults(): SeasonResults {
    return {
      laLigaWinner: null,
      championsLeagueWinner: null,
      copaReyWinner: null,
      superCopaWinner: null,
      topScorer: null,
      standOutPlayer: null,
      disappointmentPlayer: null,
      ballondOr: null,
      goldenBoot: null,
      zamoraWinner: null
    };
  }

  private saveResults(results: SeasonResults): void{
    this.seasonResultsState.set(results);
    localStorage.setItem(this.storageKey, JSON.stringify(results));
  }

  updateResults(results: SeasonResults): void {
    this.saveResults(results);
  }

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

      if (this.isCorrectPrediction(prediction.seasonPrediction.copaReyWinner, realWinners.copaReyWinner)) {
        points += this.SCORE_RULES.copaReyWinner;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.superCopaWinner, realWinners.superCopaWinner)) {
        points += this.SCORE_RULES.superCopaWinner;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.ballondOr, realWinners.ballondOr)) {
        points += this.SCORE_RULES.ballondOr;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.topScorer, realWinners.topScorer)) {
        points += this.SCORE_RULES.topScorer;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.standOutPlayer, realWinners.standOutPlayer)) {
        points += this.SCORE_RULES.standOutPlayer;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.disappointmentPlayer, realWinners.disappointmentPlayer)) {
        points += this.SCORE_RULES.disappointmentPlayer;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.zamoraWinner, realWinners.zamoraWinner)) {
        points += this.SCORE_RULES.zamoraWinner;
        correctPredictions++;
      }

      if (this.isCorrectPrediction(prediction.seasonPrediction.goldenBoot, realWinners.goldenBoot)) {
        points += this.SCORE_RULES.goldenBoot;
        correctPredictions++;
      }

      return {
        user: prediction.user,
        points,
        correctPredictions,
        totalPredictions: 10,
        breakdown: breakdown
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