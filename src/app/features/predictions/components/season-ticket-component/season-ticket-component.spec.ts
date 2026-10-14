import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SeasonTicketComponent } from './season-ticket-component';
import { UserPrediction } from '../../../home/models/user-prediction.model';

describe('SeasonTicketComponent', () => {
  let component: SeasonTicketComponent;
  let fixture: ComponentFixture<SeasonTicketComponent>;

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
      imports: [SeasonTicketComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonTicketComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render ticket when there is no prediction', () => {
    component.userPrediction = null;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).not.toContain('Mis pronósticos');
  });

  it('should display prediction data', () => {
    component.userPrediction = prediction;

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('User A');
    expect(element.textContent).toContain('FC Barcelona');
    expect(element.textContent).toContain('Real Madrid');
    expect(element.textContent).toContain('Lamine Yamal');
  });

  it('should not show edit button when not editable', () => {
    component.userPrediction = prediction;
    component.editable = false;

    fixture.detectChanges();

    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');

    expect(button).toBeNull();
  });

  it('should show edit button when editable', () => {
    component.userPrediction = prediction;
    component.editable = true;

    fixture.detectChanges();

    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');

    expect(button).not.toBeNull();
    expect(button?.textContent).toContain('Editar porra');
  });

  it('should emit editPrediction when edit button is clicked', () => {
    component.userPrediction = prediction;
    component.editable = true;

    const emitSpy = vi.spyOn(component.editPrediction, 'emit');

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should use updatedAt when available', () => {
    component.userPrediction = {
      ...prediction,
      updatedAt: '2026-10-15T12:30:00Z',
    };

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('15/10/2026');
  });
});
