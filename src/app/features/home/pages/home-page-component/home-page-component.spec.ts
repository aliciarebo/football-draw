import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { HomePageComponent } from './home-page-component';
import { PredictionFacade } from '../../../predictions/facade/predictions.facade';
import { UserPrediction } from '../../models/user-prediction.model';
import { SeasonPrediction } from '../../../predictions/models/season-prediction.model';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  const predictionFacadeMock = {
    usersPredictions: signal<UserPrediction[]>([]),
    loadingPredictions: signal(false),
    predictionsError: signal<string | null>(null),
    obtainPredictions: vi.fn(),
  };
  const seasonPrediction: SeasonPrediction = {
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
  const prediction: UserPrediction = {
    user: {
      id: 1,
      userName: 'User A',
      role: 'USER',
    },
    seasonPrediction,
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: null,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    predictionFacadeMock.usersPredictions.set([]);
    predictionFacadeMock.loadingPredictions.set(false);
    predictionFacadeMock.predictionsError.set(null);

    await TestBed.configureTestingModule({
      imports: [HomePageComponent],
      providers: [
        {
          provide: PredictionFacade,
          useValue: predictionFacadeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load predictions on init', () => {
    fixture.detectChanges();

    expect(predictionFacadeMock.obtainPredictions).toHaveBeenCalled();
  });

  it('should open prediction detail', () => {
    component.openPrediction(prediction);

    expect(component.selectedUserPrediction).toBe(prediction);
    expect(component.detailVisible).toBe(true);
  });

  it('should close prediction detail', () => {
    component.selectedUserPrediction = prediction;
    component.detailVisible = true;

    component.closePrediction();

    expect(component.detailVisible).toBe(false);
    expect(component.selectedUserPrediction).toBeNull();
  });

  it('should show loading state', () => {
    predictionFacadeMock.loadingPredictions.set(true);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Cargando porras...');
  });

  it('should show error state', () => {
    predictionFacadeMock.predictionsError.set('No se pudieron cargar las predicciones.');

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('No se pudieron cargar las predicciones.');
  });

  it('should show participant count', () => {
    predictionFacadeMock.usersPredictions.set([
      prediction,
      {
        ...prediction,
        user: {
          id: 2,
          userName: 'User B',
          role: 'USER',
        },
      },
    ]);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('2 participantes');
  });
});
