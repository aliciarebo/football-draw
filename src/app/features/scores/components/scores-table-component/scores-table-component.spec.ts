import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ScoresTableComponent } from './scores-table-component';
import { UserScore } from '../../models/season-result.model';

describe('ScoresTableComponent', () => {
  let component: ScoresTableComponent;
  let fixture: ComponentFixture<ScoresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoresTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoresTableComponent);
    component = fixture.componentInstance;
  });

  const createScore = (
    userName = 'Alicia',
    points = 25,
    correctPredictions = 2,
    breakdown: UserScore['breakdown'] = [],
    userId = 1,
  ): UserScore => ({
    user: {
      id: userId,
      userName,
      role: 'USER',
    },
    points,
    correctPredictions,
    totalPredictions: 10,
    breakdown,
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty state when there are no scores', () => {
    component.scores = [];

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Todavía no hay participantes');
  });

  it('should display participant score', () => {
    component.scores = [createScore('User A', 25, 2, [], 1)];

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('User A');
    expect(element.textContent).toContain('25');
    expect(element.textContent).toContain('2/10');
  });

  it('should display score breakdown statuses when row is expanded', () => {
    component.scores = [
      createScore('User A', 10, 1, [
        {
          label: 'LaLiga',
          points: 10,
          correct: true,
        },
        {
          label: 'Champions League',
          points: 0,
          correct: false,
        },
        {
          label: 'Copa del Rey',
          points: 0,
          correct: null,
        },
      ]),
    ];

    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('LaLiga');
    expect(element.textContent).toContain('Acertado');
    expect(element.textContent).toContain('Fallado');
    expect(element.textContent).toContain('Pendiente');
  });

  it('should display all participants', () => {
    component.scores = [createScore('User A', 25, 2, [], 1), createScore('User B', 15, 1, [], 2)];

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('User A');
    expect(element.textContent).toContain('User B');
  });
});
