import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonPredictionFormComponent } from './season-prediction-form-component';

describe('SeasonPredictionFormComponent', () => {
  let component: SeasonPredictionFormComponent;
  let fixture: ComponentFixture<SeasonPredictionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonPredictionFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonPredictionFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
