import { describe, expect, it } from 'vitest';

import { mapSeasonPredictionToRequest } from './season-prediction.mapper';
import { SeasonPrediction } from '../models/season-prediction.model';

describe('season-prediction.mapper', () => {
  it('should map season prediction to request', () => {
    const prediction: SeasonPrediction = {
      championsLeagueWinner: {
        id: 2,
        clubName: 'Real Madrid',
        shortName: 'Real Madrid',
      },
      laLigaWinner: {
        id: 15,
        clubName: 'FC Barcelona',
        shortName: 'Barcelona',
      },
      copaReyWinner: {
        id: 15,
        clubName: 'FC Barcelona',
        shortName: 'Barcelona',
      },
      superCopaWinner: {
        id: 2,
        clubName: 'Real Madrid',
        shortName: 'Real Madrid',
      },
      topScorer: {
        id: 10,
        name: 'Lamine Yamal',
        position: null,
      },
      standOutPlayer: {
        id: 11,
        name: 'Player A',
        position: null,
      },
      disappointmentPlayer: {
        id: 12,
        name: 'Player B',
        position: null,
      },
      ballondOr: {
        id: 13,
        name: 'Player C',
        position: null,
      },
      goldenBoot: {
        id: 14,
        name: 'Player D',
        position: null,
      },
      zamoraWinner: {
        id: 15,
        name: 'Goalkeeper A',
        position: 'Goalkeeper',
      },
    };

    const result = mapSeasonPredictionToRequest(prediction);

    expect(result).toEqual({
      championsLeagueWinnerId: 2,
      championsLeagueWinnerName: 'Real Madrid',

      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',

      copaReyWinnerId: 15,
      copaReyWinnerName: 'FC Barcelona',

      superCopaWinnerId: 2,
      superCopaWinnerName: 'Real Madrid',

      topScorerId: 10,
      topScorerName: 'Lamine Yamal',

      standOutPlayerId: 11,
      standOutPlayerName: 'Player A',

      disappointmentPlayerId: 12,
      disappointmentPlayerName: 'Player B',

      ballondOrId: 13,
      ballondOrName: 'Player C',

      goldenBootId: 14,
      goldenBootName: 'Player D',

      zamoraWinnerId: 15,
      zamoraWinnerName: 'Goalkeeper A',
    });
  });
});
