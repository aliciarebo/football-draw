import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { SeasonResultFacade } from './season-results.facade';
import { SeasonResultService } from '../service/season-results.service';
import { SeasonResults } from '../models/season-result.model';

describe('SeasonResultFacade', () => {
  let facade: SeasonResultFacade;

  const seasonResultServiceMock = {
    getSeasonResults: vi.fn(),
    createSeasonResults: vi.fn(),
    updateSeasonResults: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        SeasonResultFacade,
        {
          provide: SeasonResultService,
          useValue: seasonResultServiceMock,
        },
      ],
    });

    facade = TestBed.inject(SeasonResultFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should obtain and store season results', () => {
    const response = {
      id: 1,
      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',
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
    };

    seasonResultServiceMock.getSeasonResults.mockReturnValue(of(response));

    facade.obtainSeasonResults();

    expect(seasonResultServiceMock.getSeasonResults).toHaveBeenCalled();

    expect(facade.seasonResults()).toEqual({
      laLigaWinner: {
        id: 15,
        clubName: 'FC Barcelona',
        shortName: 'FC Barcelona',
      },
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

    expect(facade.loadingResults()).toBe(false);
  });

  it('should set season results to null when API returns 404', () => {
    seasonResultServiceMock.getSeasonResults.mockReturnValue(
      throwError(() => ({
        status: 404,
      })),
    );

    facade.obtainSeasonResults();

    expect(facade.seasonResults()).toBeNull();
    expect(facade.resultsError()).toBeNull();
    expect(facade.loadingResults()).toBe(false);
  });

  it('should set connection error when API is unreachable', () => {
    seasonResultServiceMock.getSeasonResults.mockReturnValue(
      throwError(() => ({
        status: 0,
      })),
    );

    facade.obtainSeasonResults();

    expect(facade.seasonResults()).toBeNull();
    expect(facade.resultsError()).toBe('No se pudo conectar con el servidor.');
    expect(facade.loadingResults()).toBe(false);
  });

  it('should set generic error when API request fails', () => {
    seasonResultServiceMock.getSeasonResults.mockReturnValue(
      throwError(() => ({
        status: 500,
      })),
    );

    facade.obtainSeasonResults();

    expect(facade.seasonResults()).toBeNull();
    expect(facade.resultsError()).toBe('No se pudieron cargar los resultados.');
    expect(facade.loadingResults()).toBe(false);
  });

  it('should create and store season results', () => {
    const results: SeasonResults = {
      laLigaWinner: {
        id: 15,
        clubName: 'FC Barcelona',
        shortName: 'Barcelona',
      },
      championsLeagueWinner: null,
      copaReyWinner: null,
      superCopaWinner: null,
      topScorer: null,
      standOutPlayer: null,
      disappointmentPlayer: null,
      ballondOr: null,
      goldenBoot: null,
      zamoraWinner: null,
    };

    const response = {
      id: 1,
      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',
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
    };

    seasonResultServiceMock.createSeasonResults.mockReturnValue(of(response));

    facade.createSeasonResults(results).subscribe();

    expect(seasonResultServiceMock.createSeasonResults).toHaveBeenCalledWith({
      laLigaWinnerId: 15,
      laLigaWinnerName: 'FC Barcelona',
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
    });

    expect(facade.seasonResults()?.laLigaWinner).toEqual({
      id: 15,
      clubName: 'FC Barcelona',
      shortName: 'FC Barcelona',
    });

    expect(facade.savingResults()).toBe(false);
  });

  it('should update and store season results', () => {
    const results: SeasonResults = {
      laLigaWinner: {
        id: 2,
        clubName: 'Real Madrid',
        shortName: 'Real Madrid',
      },
      championsLeagueWinner: null,
      copaReyWinner: null,
      superCopaWinner: null,
      topScorer: null,
      standOutPlayer: null,
      disappointmentPlayer: null,
      ballondOr: null,
      goldenBoot: null,
      zamoraWinner: null,
    };

    const response = {
      id: 1,
      laLigaWinnerId: 2,
      laLigaWinnerName: 'Real Madrid',
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
    };

    seasonResultServiceMock.updateSeasonResults.mockReturnValue(of(response));

    facade.updateSeasonResults(results).subscribe();

    expect(seasonResultServiceMock.updateSeasonResults).toHaveBeenCalledWith({
      laLigaWinnerId: 2,
      laLigaWinnerName: 'Real Madrid',
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
    });

    expect(facade.seasonResults()?.laLigaWinner).toEqual({
      id: 2,
      clubName: 'Real Madrid',
      shortName: 'Real Madrid',
    });

    expect(facade.savingResults()).toBe(false);
  });

  it('should propagate error and reset saving state when create fails', () => {
    const results: SeasonResults = {
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
    };

    const error = new Error('Create failed');

    seasonResultServiceMock.createSeasonResults.mockReturnValue(throwError(() => error));

    facade.createSeasonResults(results).subscribe({
      error: (receivedError) => {
        expect(receivedError).toBe(error);
      },
    });

    expect(facade.savingResults()).toBe(false);
  });
});
