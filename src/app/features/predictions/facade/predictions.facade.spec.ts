import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PredictionFacade } from './predictions.facade';
import { PredictionService } from '../service/prediction.service';
import { Notification } from '../../../core/service/notification.service';

import { UserPredictionResponse } from '../../home/models/user-prediction.model';

import { SeasonPrediction } from '../models/season-prediction.model';
import { CreateSeasonPredictionRequest } from '../models/create-season-prediction-request.model';

describe('PredictionFacade', () => {
  let facade: PredictionFacade;

  const predictionServiceMock = {
    getCurrentUserPrediction: vi.fn(),
    getUserPredictionById: vi.fn(),
    getPredictions: vi.fn(),
    saveCurrentPrediction: vi.fn(),
    updateCurrentPrediction: vi.fn(),
  };

  const notificationMock = {
    successMessage: vi.fn(),
    errorMessage: vi.fn(),
  };

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
      id: 10,
      name: 'Lamine Yamal',
      position: null,
    },
    disappointmentPlayer: {
      id: 20,
      name: 'Player B',
      position: null,
    },
    ballondOr: {
      id: 10,
      name: 'Lamine Yamal',
      position: null,
    },
    goldenBoot: {
      id: 10,
      name: 'Lamine Yamal',
      position: null,
    },
    zamoraWinner: {
      id: 30,
      name: 'Goalkeeper A',
      position: null,
    },
  };

  const createSeasonPredictionResponse = (
    overrides: Partial<CreateSeasonPredictionRequest> = {},
  ): CreateSeasonPredictionRequest => ({
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

    standOutPlayerId: 10,
    standOutPlayerName: 'Lamine Yamal',

    disappointmentPlayerId: 20,
    disappointmentPlayerName: 'Player B',

    ballondOrId: 10,
    ballondOrName: 'Lamine Yamal',

    goldenBootId: 10,
    goldenBootName: 'Lamine Yamal',

    zamoraWinnerId: 30,
    zamoraWinnerName: 'Goalkeeper A',

    ...overrides,
  });

  const createPredictionResponse = (
    overrides: Partial<Omit<UserPredictionResponse, 'seasonPrediction'>> = {},
    seasonPredictionOverrides: Partial<CreateSeasonPredictionRequest> = {},
  ): UserPredictionResponse => ({
    id: 1,
    user: {
      id: 1,
      userName: 'User A',
      role: 'USER',
    },
    seasonPrediction: createSeasonPredictionResponse(seasonPredictionOverrides),
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: null,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        PredictionFacade,
        {
          provide: PredictionService,
          useValue: predictionServiceMock,
        },
        {
          provide: Notification,
          useValue: notificationMock,
        },
      ],
    });

    facade = TestBed.inject(PredictionFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('obtainUserPrediction', () => {
    it('should obtain and store current user prediction', () => {
      const response = createPredictionResponse();

      predictionServiceMock.getCurrentUserPrediction.mockReturnValue(of(response));

      facade.obtainUserPrediction();

      expect(predictionServiceMock.getCurrentUserPrediction).toHaveBeenCalled();

      expect(facade.userPrediction()).not.toBeNull();

      expect(facade.userPrediction()?.user.userName).toBe('User A');

      expect(facade.userPrediction()?.seasonPrediction.laLigaWinner.clubName).toBe('FC Barcelona');

      expect(facade.loadingUserPrediction()).toBe(false);
    });

    it('should set user prediction to null when API returns 404', () => {
      predictionServiceMock.getCurrentUserPrediction.mockReturnValue(
        throwError(() => ({
          status: 404,
        })),
      );

      facade.obtainUserPrediction();

      expect(facade.userPrediction()).toBeNull();
      expect(facade.userPredictionError()).toBeNull();
      expect(facade.loadingUserPrediction()).toBe(false);
    });

    it('should set connection error when API is unreachable', () => {
      predictionServiceMock.getCurrentUserPrediction.mockReturnValue(
        throwError(() => ({
          status: 0,
        })),
      );

      facade.obtainUserPrediction();

      expect(facade.userPrediction()).toBeNull();

      expect(facade.userPredictionError()).toBe('No se pudo conectar con el servidor.');

      expect(facade.loadingUserPrediction()).toBe(false);
    });

    it('should set generic error when loading user prediction fails', () => {
      predictionServiceMock.getCurrentUserPrediction.mockReturnValue(
        throwError(() => ({
          status: 500,
        })),
      );

      facade.obtainUserPrediction();

      expect(facade.userPrediction()).toBeNull();

      expect(facade.userPredictionError()).toBe('No se pudo cargar tu porra.');

      expect(facade.loadingUserPrediction()).toBe(false);
    });
  });

  describe('obtainUserPredictionById', () => {
    it('should obtain and store user prediction by id', () => {
      const response = createPredictionResponse({
        id: 2,
        user: {
          id: 2,
          userName: 'User B',
          role: 'USER',
        },
      });

      predictionServiceMock.getUserPredictionById.mockReturnValue(of(response));

      facade.obtainUserPredictionById(2);

      expect(predictionServiceMock.getUserPredictionById).toHaveBeenCalledWith(2);

      expect(facade.userPredictionById()).not.toBeNull();

      expect(facade.userPredictionById()?.user.userName).toBe('User B');

      expect(facade.loadingUserPrediction()).toBe(false);
    });

    it('should set user prediction by id to null when no prediction is returned', () => {
      predictionServiceMock.getUserPredictionById.mockReturnValue(of(null));

      facade.obtainUserPredictionById(2);

      expect(predictionServiceMock.getUserPredictionById).toHaveBeenCalledWith(2);

      expect(facade.userPredictionById()).toBeNull();
      expect(facade.loadingUserPrediction()).toBe(false);
    });
  });

  describe('obtainPredictions', () => {
    it('should obtain and store all predictions', () => {
      const response: UserPredictionResponse[] = [
        createPredictionResponse(),
        createPredictionResponse(
          {
            id: 2,
            user: {
              id: 2,
              userName: 'User B',
              role: 'USER',
            },
            createdAt: '2026-10-14T11:00:00Z',
          },
          {
            championsLeagueWinnerId: 15,
            championsLeagueWinnerName: 'FC Barcelona',

            laLigaWinnerId: 2,
            laLigaWinnerName: 'Real Madrid',

            copaReyWinnerId: 2,
            copaReyWinnerName: 'Real Madrid',

            superCopaWinnerId: 15,
            superCopaWinnerName: 'FC Barcelona',

            topScorerId: 11,
            topScorerName: 'Player C',

            standOutPlayerId: 11,
            standOutPlayerName: 'Player C',

            disappointmentPlayerId: 21,
            disappointmentPlayerName: 'Player D',

            ballondOrId: 11,
            ballondOrName: 'Player C',

            goldenBootId: 11,
            goldenBootName: 'Player C',

            zamoraWinnerId: 31,
            zamoraWinnerName: 'Goalkeeper B',
          },
        ),
      ];

      predictionServiceMock.getPredictions.mockReturnValue(of(response));

      facade.obtainPredictions();

      expect(predictionServiceMock.getPredictions).toHaveBeenCalled();

      expect(facade.usersPredictions()).toHaveLength(2);

      expect(facade.usersPredictions()[0].user.userName).toBe('User A');

      expect(facade.usersPredictions()[1].user.userName).toBe('User B');

      expect(facade.loadingPredictions()).toBe(false);
      expect(facade.predictionsError()).toBeNull();
    });

    it('should set connection error when loading predictions fails with status 0', () => {
      predictionServiceMock.getPredictions.mockReturnValue(
        throwError(() => ({
          status: 0,
        })),
      );

      facade.obtainPredictions();

      expect(facade.usersPredictions()).toEqual([]);

      expect(facade.predictionsError()).toBe('No se pudo conectar con el servidor.');

      expect(facade.loadingPredictions()).toBe(false);
    });

    it('should set generic error when loading predictions fails', () => {
      predictionServiceMock.getPredictions.mockReturnValue(
        throwError(() => ({
          status: 500,
        })),
      );

      facade.obtainPredictions();

      expect(facade.usersPredictions()).toEqual([]);

      expect(facade.predictionsError()).toBe('No se pudieron cargar las predicciones.');

      expect(facade.loadingPredictions()).toBe(false);
    });
  });

  describe('createPrediction', () => {
    it('should create and store prediction', () => {
      const response = createPredictionResponse({
        user: {
          id: 1,
          userName: 'User A',
          role: 'USER',
        },
      });

      predictionServiceMock.saveCurrentPrediction.mockReturnValue(of(response));

      facade.createPrediction(prediction).subscribe();

      expect(predictionServiceMock.saveCurrentPrediction).toHaveBeenCalled();

      expect(facade.userPrediction()?.user.userName).toBe('User A');

      expect(notificationMock.successMessage).toHaveBeenCalledWith(
        'Porra guardada',
        'Tus predicciones se han guardado correctamente.',
      );

      expect(facade.savingPrediction()).toBe(false);
    });

    it('should show error notification when create prediction fails', () => {
      const error = new Error('Create failed');

      predictionServiceMock.saveCurrentPrediction.mockReturnValue(throwError(() => error));

      facade.createPrediction(prediction).subscribe({
        error: (receivedError) => {
          expect(receivedError).toBe(error);
        },
      });

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error',
        'No se pudieron guardar tus predicciones.',
      );

      expect(facade.savingPrediction()).toBe(false);
    });
  });

  describe('updatePrediction', () => {
    it('should update and store prediction', () => {
      const response = createPredictionResponse({
        user: {
          id: 1,
          userName: 'User A',
          role: 'USER',
        },
        updatedAt: '2026-10-14T12:00:00Z',
      });

      predictionServiceMock.updateCurrentPrediction.mockReturnValue(of(response));

      facade.updatePrediction(prediction).subscribe();

      expect(predictionServiceMock.updateCurrentPrediction).toHaveBeenCalled();

      expect(facade.userPrediction()?.updatedAt).toBe('2026-10-14T12:00:00Z');

      expect(notificationMock.successMessage).toHaveBeenCalledWith(
        'Porra actualizada',
        'Tus cambios se han guardado correctamente.',
      );

      expect(facade.savingPrediction()).toBe(false);
    });

    it('should show error notification when update prediction fails', () => {
      const error = new Error('Update failed');

      predictionServiceMock.updateCurrentPrediction.mockReturnValue(throwError(() => error));

      facade.updatePrediction(prediction).subscribe({
        error: (receivedError) => {
          expect(receivedError).toBe(error);
        },
      });

      expect(notificationMock.errorMessage).toHaveBeenCalledWith(
        'Error',
        'No se pudieron guardar tus cambios.',
      );

      expect(facade.savingPrediction()).toBe(false);
    });
  });
});
