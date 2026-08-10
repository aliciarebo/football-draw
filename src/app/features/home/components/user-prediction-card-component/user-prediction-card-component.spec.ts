import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPredictionCardComponent } from './user-prediction-card-component';

describe('UserPredictionCardComponent', () => {
  let component: UserPredictionCardComponent;
  let fixture: ComponentFixture<UserPredictionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPredictionCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPredictionCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
