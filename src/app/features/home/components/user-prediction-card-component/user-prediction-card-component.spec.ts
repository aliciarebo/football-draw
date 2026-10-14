import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UserPredictionCardComponent } from './user-prediction-card-component';
import { UserPrediction } from '../../models/user-prediction.model';

describe('UserPredictionCardComponent', () => {
  let component: UserPredictionCardComponent;
  let fixture: ComponentFixture<UserPredictionCardComponent>;

  const prediction: UserPrediction = {
    user: {
      id: 1,
      userName: 'User A',
      role: 'USER',
    },
    seasonPrediction: {
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
    },
    createdAt: '2026-10-14T10:00:00Z',
    updatedAt: null,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPredictionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPredictionCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render card when there is no prediction', () => {
    component.userPrediction = null;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).not.toContain('Porra completada');
  });

  it('should display prediction summary', () => {
    component.userPrediction = prediction;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('User A');
    expect(element.textContent).toContain('FC Barcelona');
    expect(element.textContent).toContain('Real Madrid');
    expect(element.textContent).toContain('Lamine Yamal');
  });

  it('should display user initial', () => {
    component.userPrediction = prediction;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('A');
  });

  it('should emit openPrediction when button is clicked', () => {
    component.userPrediction = prediction;

    const emitSpy = vi.spyOn(component.openPrediction, 'emit');

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });
});
