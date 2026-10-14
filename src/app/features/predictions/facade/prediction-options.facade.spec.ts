import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PredictionOptionsFacade } from './prediction-options.facade';
import { PlayerService } from '../../../core/service/football-players-api.service';
import { FootballService } from '../../../core/service/football-api.service';

import { Team } from '../models/team-model';
import { Player } from '../models/player.model';

describe('PredictionOptionsFacade', () => {
  let facade: PredictionOptionsFacade;

  const playerServiceMock = {
    getLaLigaPlayers: vi.fn(),
    getBallonDorPlayers: vi.fn(),
  };

  const footballServiceMock = {
    getLaLigaTeams: vi.fn(),
    getChampionsLeagueTeams: vi.fn(),
  };

  const laLigaTeams: Team[] = [
    {
      id: 1,
      clubName: 'FC Barcelona',
      shortName: 'Barcelona',
    },
    {
      id: 2,
      clubName: 'Real Madrid',
      shortName: 'Real Madrid',
    },
  ];

  const championsTeams: Team[] = [
    {
      id: 3,
      clubName: 'Liverpool',
      shortName: 'Liverpool',
    },
  ];

  const laLigaPlayers: Player[] = [
    {
      id: 10,
      name: 'Lamine Yamal',
      position: 'Forward',
    },
    {
      id: 20,
      name: 'Thibaut Courtois',
      position: 'Goalkeeper',
    },
  ];

  const ballonDorPlayers: Player[] = [
    {
      id: 30,
      name: 'Player A',
      position: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        PredictionOptionsFacade,
        {
          provide: PlayerService,
          useValue: playerServiceMock,
        },
        {
          provide: FootballService,
          useValue: footballServiceMock,
        },
      ],
    });

    facade = TestBed.inject(PredictionOptionsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should obtain and store LaLiga teams', () => {
    footballServiceMock.getLaLigaTeams.mockReturnValue(of(laLigaTeams));

    facade.obtainLaLigaTeams();

    expect(footballServiceMock.getLaLigaTeams).toHaveBeenCalled();

    expect(facade.laLigaTeams()).toEqual(laLigaTeams);
  });

  it('should obtain and store Champions League teams', () => {
    footballServiceMock.getChampionsLeagueTeams.mockReturnValue(of(championsTeams));

    facade.obtainChampionsLeagueTeams();

    expect(footballServiceMock.getChampionsLeagueTeams).toHaveBeenCalled();

    expect(facade.championsTeams()).toEqual(championsTeams);
  });

  it('should obtain and store LaLiga players', () => {
    playerServiceMock.getLaLigaPlayers.mockReturnValue(of(laLigaPlayers));

    facade.obtainLaLigaPlayers();

    expect(playerServiceMock.getLaLigaPlayers).toHaveBeenCalled();

    expect(facade.laLigaPlayers()).toEqual(laLigaPlayers);
  });

  it('should obtain and store Ballon dOr players', () => {
    playerServiceMock.getBallonDorPlayers.mockReturnValue(of(ballonDorPlayers));

    facade.obtainBallonDorPlayers();

    expect(playerServiceMock.getBallonDorPlayers).toHaveBeenCalled();

    expect(facade.ballonDorPlayers()).toEqual(ballonDorPlayers);
  });

  it('should return only goalkeeper players', () => {
    playerServiceMock.getLaLigaPlayers.mockReturnValue(of(laLigaPlayers));

    facade.obtainLaLigaPlayers();

    expect(facade.goalkeeperPlayers()).toEqual([
      {
        id: 20,
        name: 'Thibaut Courtois',
        position: 'Goalkeeper',
      },
    ]);
  });

  it('should load options only when they are not already loaded', () => {
    footballServiceMock.getLaLigaTeams.mockReturnValue(of(laLigaTeams));

    footballServiceMock.getChampionsLeagueTeams.mockReturnValue(of(championsTeams));

    playerServiceMock.getLaLigaPlayers.mockReturnValue(of(laLigaPlayers));

    playerServiceMock.getBallonDorPlayers.mockReturnValue(of(ballonDorPlayers));

    facade.loadOptions();

    expect(footballServiceMock.getLaLigaTeams).toHaveBeenCalledTimes(1);

    expect(footballServiceMock.getChampionsLeagueTeams).toHaveBeenCalledTimes(1);

    expect(playerServiceMock.getLaLigaPlayers).toHaveBeenCalledTimes(1);

    expect(playerServiceMock.getBallonDorPlayers).toHaveBeenCalledTimes(1);

    facade.loadOptions();

    expect(footballServiceMock.getLaLigaTeams).toHaveBeenCalledTimes(1);

    expect(footballServiceMock.getChampionsLeagueTeams).toHaveBeenCalledTimes(1);

    expect(playerServiceMock.getLaLigaPlayers).toHaveBeenCalledTimes(1);

    expect(playerServiceMock.getBallonDorPlayers).toHaveBeenCalledTimes(1);
  });

  it('should keep teams empty when loading LaLiga teams fails', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    footballServiceMock.getLaLigaTeams.mockReturnValue(
      throwError(() => new Error('Request failed')),
    );

    facade.obtainLaLigaTeams();

    expect(facade.laLigaTeams()).toEqual([]);

    consoleSpy.mockRestore();
  });
});
