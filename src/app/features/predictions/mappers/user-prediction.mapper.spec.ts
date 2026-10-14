import { describe, expect, it } from 'vitest';

import { mapUserPredictionResponse } from './user-prediction.mapper';
import { UserPredictionResponse } from '../../home/models/user-prediction.model';

describe('user-prediction.mapper', () => {
  it('should map user prediction response', () => {
    const response: UserPredictionResponse = {
      id: 1,
      user: {
        id: 1,
        userName: 'User A',
        role: 'USER',
      },
      seasonPrediction: {
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
      },
      createdAt: '2026-10-14T10:00:00Z',
      updatedAt: '2026-10-14T12:00:00Z',
    };

    const result = mapUserPredictionResponse(response);

    expect(result).toEqual({
      user: {
        id: 1,
        userName: 'User A',
        role: 'USER',
      },
      seasonPrediction: {
        championsLeagueWinner: {
          id: 2,
          clubName: 'Real Madrid',
        },
        laLigaWinner: {
          id: 15,
          clubName: 'FC Barcelona',
        },
        copaReyWinner: {
          id: 15,
          clubName: 'FC Barcelona',
        },
        superCopaWinner: {
          id: 2,
          clubName: 'Real Madrid',
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
          position: null,
        },
      },
      createdAt: '2026-10-14T10:00:00Z',
      updatedAt: '2026-10-14T12:00:00Z',
    });
  });
});
