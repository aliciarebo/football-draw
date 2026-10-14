import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MyPredictionPagesComponent } from './my-prediction-pages-component';
import { PredictionOptionsFacade } from '../../facade/prediction-options.facade';
import { PredictionFacade } from '../../facade/predictions.facade';
import { SeasonPrediction } from '../../models/season-prediction.model';
import { UserPrediction } from '../../../home/models/user-prediction.model';

describe('MyPredictionPagesComponent', () => {
  let component: MyPredictionPagesComponent;
  let fixture: ComponentFixture<MyPredictionPagesComponent>;

  const predictionFacadeMock = {
    userPrediction: signal<UserPrediction | null>(null),
    savingPrediction: signal(false),
    loadingUserPrediction: signal(false),
    userPredictionError: signal<string | null>(null),

    obtainUserPrediction: vi.fn(),
    createPrediction: vi.fn(),
    updatePrediction: vi.fn(),
  };

  const optionsFacadeMock = {
    laLigaTeams: signal([]),
    championsTeams: signal([]),
    laLigaPlayers: signal([]),
    goalkeeperPlayers: signal([]),
    ballonDorPlayers: signal([]),

    loadOptions: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    predictionFacadeMock.userPrediction.set(null);
    predictionFacadeMock.savingPrediction.set(false);
    predictionFacadeMock.loadingUserPrediction.set(false);
    predictionFacadeMock.userPredictionError.set(null);

    await TestBed.configureTestingModule({
      imports: [MyPredictionPagesComponent],
      providers: [
        {
          provide: PredictionFacade,
          useValue: predictionFacadeMock,
        },
        {
          provide: PredictionOptionsFacade,
          useValue: optionsFacadeMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPredictionPagesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load options and user prediction on init', () => {
    fixture.detectChanges();

    expect(optionsFacadeMock.loadOptions).toHaveBeenCalled();
    expect(predictionFacadeMock.obtainUserPrediction).toHaveBeenCalled();
  });

  it('should open drawer', () => {
    component.openDrawer();

    expect(component.drawerVisible()).toBe(true);
  });

  it('should close drawer', () => {
    component.drawerVisible.set(true);

    component.closeDrawer();

    expect(component.drawerVisible()).toBe(false);
  });

  it('should open drawer when editing prediction', () => {
    component.editPrediction();

    expect(component.drawerVisible()).toBe(true);
  });

  it('should create prediction when no prediction exists', () => {
    const prediction = {} as SeasonPrediction;

    predictionFacadeMock.createPrediction.mockReturnValue(of(null));

    component.drawerVisible.set(true);

    component.savePrediction(prediction);

    expect(predictionFacadeMock.createPrediction).toHaveBeenCalledWith(prediction);

    expect(predictionFacadeMock.updatePrediction).not.toHaveBeenCalled();

    expect(component.drawerVisible()).toBe(false);
  });

  it('should update prediction when prediction already exists', () => {
    const prediction = {} as SeasonPrediction;

    predictionFacadeMock.userPrediction.set({
      user: {
        id: 1,
        userName: 'User A',
        role: 'USER',
      },
      seasonPrediction: prediction,
      createdAt: '2026-10-14T10:00:00Z',
      updatedAt: null,
    });

    predictionFacadeMock.updatePrediction.mockReturnValue(of(null));

    component.drawerVisible.set(true);

    component.savePrediction(prediction);

    expect(predictionFacadeMock.updatePrediction).toHaveBeenCalledWith(prediction);

    expect(predictionFacadeMock.createPrediction).not.toHaveBeenCalled();

    expect(component.drawerVisible()).toBe(false);
  });

  it('should show loading state', () => {
    predictionFacadeMock.loadingUserPrediction.set(true);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Cargando tu porra...');
  });

  it('should show error state', () => {
    predictionFacadeMock.userPredictionError.set('No se pudo conectar con el servidor.');

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('No se pudo cargar tu porra');
    expect(element.textContent).toContain('No se pudo conectar con el servidor.');
  });

  it('should show empty state when user has no prediction', () => {
    predictionFacadeMock.userPrediction.set(null);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Todavía no tienes ninguna porra');

    expect(element.textContent).toContain('Crear porra');
  });
});
