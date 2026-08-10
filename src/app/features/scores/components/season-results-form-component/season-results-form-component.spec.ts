import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonResultsFormComponent } from './season-results-form-component';

describe('SeasonResultsFormComponent', () => {
  let component: SeasonResultsFormComponent;
  let fixture: ComponentFixture<SeasonResultsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonResultsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SeasonResultsFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
