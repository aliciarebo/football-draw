import { beforeEach, describe, expect, it } from 'vitest';
import { ScoresService } from './scores.service';
import { UserPrediction } from '../../home/models/user-prediction.model';
import { SeasonResults } from '../models/season-result.model';
import { Team } from '../../predictions/models/team-model';

describe('ScoresService', () => {
  let service: ScoresService;
  const barcelona = {
    id: 1,
    clubName: 'FC Barcelona',
    shortName: 'Barcelona',
  };

  const realMadrid = {
    id: 2,
    clubName: 'Real Madrid CF',
    shortName: 'Real Madrid',
  };

  const player = {
    id: 1,
    name: 'Player',
    position: 'Forward',
  };

  beforeEach(() => {
    service = new ScoresService();
  });

  const createPrediction = (
    laLigaWinner: Team,
    userName = 'Alicia',
    userId = 1,
  ): UserPrediction => ({
    user: {
      id: userId,
      userName,
      role: 'USER',
    },

    seasonPrediction: {
      laLigaWinner,
      championsLeagueWinner: realMadrid,
      copaReyWinner: realMadrid,
      superCopaWinner: realMadrid,

      topScorer: player,
      standOutPlayer: player,
      disappointmentPlayer: player,
      ballondOr: player,
      goldenBoot: player,
      zamoraWinner: player,
    },

    createdAt: '2026-10-12',
  });

  const createResults = (laLigaWinner: Team | null = null): SeasonResults => ({
    laLigaWinner,

    championsLeagueWinner: null,
    copaReyWinner: null,
    superCopaWinner: null,

    topScorer: null,
    standOutPlayer: null,
    disappointmentPlayer: null,
    ballondOr: null,
    goldenBoot: null,
    zamoraWinner: null,
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add 10 points when LaLiga winner is correct', () => {
    const prediction = createPrediction(barcelona);
    const results = createResults(barcelona);

    const scores = service.calculateScores([prediction], results);

    expect(scores[0].points).toBe(10);
    expect(scores[0].correctPredictions).toBe(1);
  });

  it('should add 0 points when LaLiga winner is incorrect', () => {
    const prediction = createPrediction(barcelona);
    const results = createResults(realMadrid);

    const scores = service.calculateScores([prediction], results);

    expect(scores[0].points).toBe(0);
    expect(scores[0].correctPredictions).toBe(0);
  });

  it('should add 0 points when LaLiga winner is unknown', () => {
    const prediction = createPrediction(barcelona);
    const results = createResults(null);

    const scores = service.calculateScores([prediction], results);

    expect(scores[0].points).toBe(0);
    expect(scores[0].correctPredictions).toBe(0);
    expect(scores[0].breakdown[0].correct).toBeNull();
  });

  it('should calculate points from multiple correct predictions', () => {
    const prediction = createPrediction(barcelona);

    const results: SeasonResults = {
      laLigaWinner: barcelona,
      championsLeagueWinner: realMadrid,
      copaReyWinner: null,
      superCopaWinner: null,
      topScorer: null,
      standOutPlayer: null,
      disappointmentPlayer: null,
      ballondOr: null,
      goldenBoot: null,
      zamoraWinner: null,
    };

    const scores = service.calculateScores([prediction], results);

    expect(scores[0].points).toBe(25);
    expect(scores[0].correctPredictions).toBe(2);
  });

  it('should sort users by points descending', () => {
    const predictionA = createPrediction(realMadrid, 'User A', 1);
    const predictionB = createPrediction(barcelona, 'User B', 2);

    const results: SeasonResults = {
      laLigaWinner: barcelona,
      championsLeagueWinner: realMadrid,
      copaReyWinner: null,
      superCopaWinner: null,
      topScorer: null,
      standOutPlayer: null,
      disappointmentPlayer: null,
      ballondOr: null,
      goldenBoot: null,
      zamoraWinner: null,
    };

    const scores = service.calculateScores([predictionA, predictionB], results);

    expect(scores[0].points).toBeGreaterThan(scores[1].points);
    expect(scores[0].user.userName).toBe('User B');
  });

  it('should mark LaLiga prediction as correct in breakdown', () => {
    const prediction = createPrediction(barcelona);
    const results = createResults(barcelona);

    const scores = service.calculateScores([prediction], results);

    expect(scores[0].breakdown[0]).toEqual({
      label: 'LaLiga',
      points: 10,
      correct: true,
    });
  });
});
