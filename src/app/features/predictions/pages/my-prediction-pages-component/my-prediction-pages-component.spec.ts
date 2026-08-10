import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPredictionPagesComponent } from './my-prediction-pages-component';

describe('MyResultPagesComponent', () => {
  let component: MyPredictionPagesComponent;
  let fixture: ComponentFixture<MyPredictionPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPredictionPagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPredictionPagesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
