import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ScoresPageComponent } from './scores-page-component';
import { PredictionFacade } from '../../../predictions/facade/predictions.facade';
import { SeasonResultFacade } from '../../facade/season-results.facade';
import { ScoresService } from '../../service/scores.service';
import { signal } from '@angular/core';
import { SeasonResults } from '../../models/season-result.model';
import { UserPrediction } from '../../../home/models/user-prediction.model';

describe('ScoresPageComponent', () => {
  let component: ScoresPageComponent;
  let fixture: ComponentFixture<ScoresPageComponent>;

  const predictionFacadeMock = {
    usersPredictions: signal<UserPrediction[]>([]),
    loadingPredictions: signal(false),
    predictionsError: signal<string | null>(null),
    obtainPredictions: vi.fn(),
  };

  const seasonResultFacadeMock = {
    seasonResults: signal<SeasonResults | null>(null),
    loadingResults: signal(false),
    resultsError: signal<string | null>(null),
    obtainSeasonResults: vi.fn(),
  };

  const scoresServiceMock = {
    calculateScores: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [ScoresPageComponent],
      providers: [
        {
          provide: PredictionFacade,
          useValue: predictionFacadeMock,
        },
        {
          provide: SeasonResultFacade,
          useValue: seasonResultFacadeMock,
        },
        {
          provide: ScoresService,
          useValue: scoresServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoresPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load predictions and season results on init', () => {
    fixture.detectChanges();

    expect(predictionFacadeMock.obtainPredictions).toHaveBeenCalled();
    expect(seasonResultFacadeMock.obtainSeasonResults).toHaveBeenCalled();
  });

  it('should return empty scores when there are no season results', () => {
    const scores = component.scores();

    expect(scores).toEqual([]);
  });

  it('should calculate scores when season results exist', () => {
    const results = {
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

    seasonResultFacadeMock.seasonResults.set(results);

    predictionFacadeMock.usersPredictions.set([]);

    scoresServiceMock.calculateScores.mockReturnValue([]);

    const scores = component.scores();

    expect(scoresServiceMock.calculateScores).toHaveBeenCalledWith([], results);

    expect(scores).toEqual([]);
  });

  it('should show empty state when there are no season results', () => {
    seasonResultFacadeMock.seasonResults.set(null);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Todavía no hay resultados oficiales');
  });
});
