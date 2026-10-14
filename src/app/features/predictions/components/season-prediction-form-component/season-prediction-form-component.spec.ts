import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SeasonPredictionFormComponent } from './season-prediction-form-component';
import { SeasonPrediction } from '../../models/season-prediction.model';

describe('SeasonPredictionFormComponent', () => {
  let component: SeasonPredictionFormComponent;
  let fixture: ComponentFixture<SeasonPredictionFormComponent>;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonPredictionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonPredictionFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with invalid form', () => {
    expect(component.seasonPredictionForm.invalid).toBe(true);
  });

  it('should not emit prediction when form is invalid', () => {
    const emitSpy = vi.spyOn(component.seasonPrediction, 'emit');

    component.savePrediction();

    expect(component.formSubmitted).toBe(true);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit prediction when form is valid', () => {
    const emitSpy = vi.spyOn(component.seasonPrediction, 'emit');

    component.seasonPredictionForm.setValue({
      laLigaWinner: prediction.laLigaWinner,
      championsWinner: prediction.championsLeagueWinner,
      copaReyWinner: prediction.copaReyWinner,
      superCopaWinner: prediction.superCopaWinner,
      topScorer: prediction.topScorer,
      standOutPlayer: prediction.standOutPlayer,
      disappointmentPlayer: prediction.disappointmentPlayer,
      ballondOr: prediction.ballondOr,
      goldenBoot: prediction.goldenBoot,
      zamoraWinner: prediction.zamoraWinner,
    });

    component.savePrediction();

    expect(emitSpy).toHaveBeenCalledWith(prediction);
  });

  it('should patch form when initialPrediction changes', () => {
    component.initialPrediction = prediction;

    component.ngOnChanges({
      initialPrediction: {
        currentValue: prediction,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.seasonPredictionForm.value.laLigaWinner).toEqual(prediction.laLigaWinner);

    expect(component.seasonPredictionForm.value.topScorer).toEqual(prediction.topScorer);
  });

  it('should show error message when submitting invalid form', () => {
    component.savePrediction();

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Debes completar todo el formulario.');
  });

  it('should show save changes label when initial prediction exists', () => {
    component.initialPrediction = prediction;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Guardar cambios');
  });

  it('should disable submit button when saving', () => {
    component.saving = true;

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
  });
});
