import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoresTableComponent } from './scores-table-component';

describe('ScoresTableComponent', () => {
  let component: ScoresTableComponent;
  let fixture: ComponentFixture<ScoresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoresTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoresTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
