import { describe, expect, it } from 'vitest';

import { mapSeasonResultsResponse, mapSeasonResultsToRequest } from './season-results.mapper';

import { SeasonResults, SeasonResultsResponse } from '../models/season-result.model';

describe('season-results.mapper', () => {
  const createResponse = (
    overrides: Partial<SeasonResultsResponse> = {},
  ): SeasonResultsResponse => ({
    id: 1,
    laLigaWinnerId: null,
    laLigaWinnerName: null,
    championsLeagueWinnerId: null,
    championsLeagueWinnerName: null,
    copaReyWinnerId: null,
    copaReyWinnerName: null,
    superCopaWinnerId: null,
    superCopaWinnerName: null,
    topScorerId: null,
    topScorerName: null,
    standOutPlayerId: null,
    standOutPlayerName: null,
    disappointmentPlayerId: null,
    disappointmentPlayerName: null,
    ballondOrId: null,
    ballondOrName: null,
    goldenBootId: null,
    goldenBootName: null,
    zamoraWinnerId: null,
    zamoraWinnerName: null,
    ...overrides,
  });

  const createResults = (overrides: Partial<SeasonResults> = {}): SeasonResults => ({
    laLigaWinner: null,
    championsLeagueWinner: null,
    copaReyWinner: null,
    superCopaWinner: null,
    topScorer: null,
    standOutPlayer: null,
    disappointmentPlayer: null,
    ballondOr: null,
    goldenBoot: null,
    zamoraWinner: null,
    ...overrides,
  });

  it('should map season results response', () => {
    const response = createResponse({
      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',
      topScorerId: 10,
      topScorerName: 'Lamine Yamal',
    });

    const result = mapSeasonResultsResponse(response);

    expect(result.laLigaWinner).toEqual({
      id: 15,
      clubName: 'FC Barcelona',
      shortName: 'FC Barcelona',
    });

    expect(result.topScorer).toEqual({
      id: 10,
      name: 'Lamine Yamal',
      position: null,
    });

    expect(result.championsLeagueWinner).toBeNull();
  });

  it('should map season results to request', () => {
    const results = createResults({
      laLigaWinner: {
        id: 15,
        clubName: 'FC Barcelona',
        shortName: 'Barcelona',
      },
      topScorer: {
        id: 10,
        name: 'Lamine Yamal',
        position: 'Forward',
      },
    });

    const request = mapSeasonResultsToRequest(results);

    expect(request).toEqual({
      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',

      championsLeagueWinnerId: null,
      championsLeagueWinnerName: null,

      copaReyWinnerId: null,
      copaReyWinnerName: null,

      superCopaWinnerId: null,
      superCopaWinnerName: null,

      topScorerId: 10,
      topScorerName: 'Lamine Yamal',

      standOutPlayerId: null,
      standOutPlayerName: null,

      disappointmentPlayerId: null,
      disappointmentPlayerName: null,

      ballondOrId: null,
      ballondOrName: null,

      goldenBootId: null,
      goldenBootName: null,

      zamoraWinnerId: null,
      zamoraWinnerName: null,
    });
  });

  it('should map empty response values to null', () => {
    const result = mapSeasonResultsResponse(createResponse());

    expect(result).toEqual({
      laLigaWinner: null,
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
  });
});
